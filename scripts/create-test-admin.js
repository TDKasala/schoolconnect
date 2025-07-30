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
  email: 'testadmin@schoolconnect.com',
  password: 'TestAdmin123!',
  fullName: 'Test Admin User'
};

async function createTestAdmin() {
  console.log('Creating test platform admin user...');
  
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: testAdmin.email,
      password: testAdmin.password,
      options: {
        data: {
          full_name: testAdmin.fullName
        }
      }
    });
    
    if (error) {
      console.error('Error signing up:', error.message);
      return;
    }
    
    console.log('User signed up successfully:', data.user?.id);
    
    // Update user role to platform_admin in the public.users table
    if (data.user?.id) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          role: 'platform_admin',
          school_id: null,
          updated_at: new Date()
        })
        .eq('id', data.user.id);
        
      if (updateError) {
        console.error('Error updating user role:', updateError.message);
        return;
      }
      
      console.log('User role updated to platform_admin successfully');
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
