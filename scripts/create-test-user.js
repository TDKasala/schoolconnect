import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  console.log('🚀 Creating test user for SchoolConnect...');
  
  const testUser = {
    email: 'test@schoolconnect.cd',
    password: 'TestPassword123!',
    full_name: 'Test User',
    role: 'teacher'
  };

  try {
    // 1. Create auth user
    console.log('📝 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: {
        full_name: testUser.full_name
      }
    });

    if (authError) {
      console.error('❌ Auth user creation failed:', authError);
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // 2. Create profile in users table
    console.log('👤 Creating user profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: testUser.email,
        full_name: testUser.full_name,
        role: testUser.role,
        approved: true // Pre-approve for testing
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      return;
    }

    console.log('✅ User profile created:', profileData);

    console.log('\n🎉 Test user created successfully!');
    console.log('\n📋 Login credentials:');
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
    console.log(`Role: ${testUser.role}`);
    console.log('\n🌐 You can now test login at: http://localhost:5173/connexion');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createTestUser();
