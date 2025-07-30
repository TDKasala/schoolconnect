// Script to create a test platform admin user
// This script demonstrates how to programmatically create a platform admin user

import { createClient } from '@supabase/supabase-js';

// Supabase configuration (using the same as in the app)
const supabaseUrl = 'https://urtsvqedsewswknyxvnw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydHN2cWVkc2V3c3drbnl4dm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTgzMTYsImV4cCI6MjA2OTAzNDMxNn0.0u-JwSKSisSH1elVir0tsrbPwPmg4OK-Hn6eenjjAjc';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test platform admin user credentials
const testAdmin = {
  email: 'testadmin2@schoolconnect.com',
  password: 'TestAdmin123!',
  fullName: 'Test Admin User'
};

async function createTestAdmin() {
  console.log('Creating test platform admin user...');
  
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: testAdmin.email,
      password: testAdmin.password
    });
    
    if (error) {
      console.error('Error signing up:', error.message);
      return;
    }
    
    console.log('User signed up successfully:', data.user?.id);
    
    // Update user role to platform_admin in the public.users table
    if (data.user?.id) {
      // First, we need to insert the user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: testAdmin.email,
          full_name: testAdmin.fullName,
          role: 'platform_admin',
          school_id: null,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        });
        
      if (insertError) {
        // If insert fails, try update
        const { error: updateError } = await supabase
          .from('users')
          .update({
            full_name: testAdmin.fullName,
            role: 'platform_admin',
            school_id: null,
            updated_at: new Date()
          })
          .eq('id', data.user.id);
          
        if (updateError) {
          console.error('Error updating user profile:', updateError.message);
          return;
        }
        
        console.log('User profile updated successfully');
      } else {
        console.log('User profile created successfully');
      }
    }
    
    console.log('\nTest platform admin user created successfully!');
    console.log('Email:', testAdmin.email);
    console.log('Password:', testAdmin.password);
    console.log('Full Name:', testAdmin.fullName);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the function
createTestAdmin();
