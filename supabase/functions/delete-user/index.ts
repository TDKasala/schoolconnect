import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create regular client to verify the requesting user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user is authenticated and get their info
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if the authenticated user is a platform admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'platform_admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Only platform admins can delete users.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the user ID to delete from the request body (safe parse)
    let userId: string | undefined
    try {
      const body = await req.json()
      userId = body?.userId
    } catch (_e) {
      // fallthrough to error below
    }
    if (!userId || typeof userId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing userId in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Platform admin ${user.email} attempting to delete user ${userId}`)

    // Get user data before deletion for logging
    const { data: targetUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('email, full_name, role')
      .eq('id', userId)
      .single()

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: `User not found: ${fetchError.message}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Delete user from Supabase Auth using admin client
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authDeleteError) {
      console.error('Error deleting user from auth:', authDeleteError)
      // If it's just "user not found", continue with database cleanup
      if (!authDeleteError.message.includes('User not found')) {
        return new Response(
          JSON.stringify({ error: `Auth deletion failed: ${authDeleteError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Explicit cleanup for related data (in case FKs are not cascading)
    // 1) Delete direct messages where user is sender or receiver
    const { error: msgDelError } = await supabaseAdmin
      .from('messages')
      .delete()
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

    if (msgDelError) {
      console.error('Error deleting user messages:', msgDelError)
      return new Response(
        JSON.stringify({ error: `Message cleanup failed: ${msgDelError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2) Delete profile row if your schema has it
    try {
      await supabaseAdmin.from('profiles').delete().eq('user_id', userId)
    } catch (profErr) {
      console.warn('Profile cleanup warning (continuing):', profErr)
    }

    // 3) Delete user row (if not already cascaded)
    const { error: dbDeleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (dbDeleteError) {
      console.error('Error deleting user from database:', dbDeleteError)
      return new Response(
        JSON.stringify({ error: `Database deletion failed: ${dbDeleteError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the deletion activity
    try {
      await supabaseAdmin
        .from('activity_logs')
        .insert({
          action: 'User Deleted',
          description: `User ${targetUser.full_name} (${targetUser.email}) with role ${targetUser.role} was deleted by ${user.email}`,
          user_id: user.id,
          target_id: userId,
          target_type: 'user',
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      console.error('Error logging deletion activity:', logError)
      // Don't fail the operation if logging fails
    }

    console.log(`User ${targetUser.email} successfully deleted by ${user.email}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User ${targetUser.full_name} (${targetUser.email}) has been successfully deleted.` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
