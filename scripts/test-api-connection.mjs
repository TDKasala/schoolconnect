// Script to test API connections and debug dashboard data issues
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://urtsvqedsewswknyxvnw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydHN2cWVkc2V3c3drbnl4dm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTgzMTYsImV4cCI6MjA2OTAzNDMxNn0.0u-JwSKSisSH1elVir0tsrbPwPmg4OK-Hn6eenjjAjc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testApiConnection() {
  console.log('=== Testing API Connection ===');
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Supabase connection successful');

    // Test 2: Check table structures
    console.log('\n2. Testing table structures...');
    
    // Test users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, role, school_id, is_active')
      .limit(1);
    
    if (usersError) {
      console.error('❌ Users table error:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
      console.log('Users sample:', usersData);
    }

    // Test schools table
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name, is_active')
      .limit(1);
    
    if (schoolsError) {
      console.error('❌ Schools table error:', schoolsError.message);
    } else {
      console.log('✅ Schools table accessible');
      console.log('Schools sample:', schoolsData);
    }

    // Test students table
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('id, first_name, last_name, school_id')
      .limit(1);
    
    if (studentsError) {
      console.error('❌ Students table error:', studentsError.message);
    } else {
      console.log('✅ Students table accessible');
      console.log('Students sample:', studentsData);
    }

    // Test classes table
    const { data: classesData, error: classesError } = await supabase
      .from('classes')
      .select('id, name, school_id')
      .limit(1);
    
    if (classesError) {
      console.error('❌ Classes table error:', classesError.message);
    } else {
      console.log('✅ Classes table accessible');
      console.log('Classes sample:', classesData);
    }

    // Test 3: Check counts for dashboard stats
    console.log('\n3. Testing count queries for dashboard stats...');
    
    const { count: totalUsers, error: usersCountError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (usersCountError) {
      console.error('❌ Users count error:', usersCountError.message);
    } else {
      console.log('✅ Total users:', totalUsers);
    }

    const { count: totalSchools, error: schoolsCountError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true });
    
    if (schoolsCountError) {
      console.error('❌ Schools count error:', schoolsCountError.message);
    } else {
      console.log('✅ Total schools:', totalSchools);
    }

    const { count: totalStudents, error: studentsCountError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });
    
    if (studentsCountError) {
      console.error('❌ Students count error:', studentsCountError.message);
    } else {
      console.log('✅ Total students:', totalStudents);
    }

    const { count: totalClasses, error: classesCountError } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true });
    
    if (classesCountError) {
      console.error('❌ Classes count error:', classesCountError.message);
    } else {
      console.log('✅ Total classes:', totalClasses);
    }

    // Test 4: Check for platform admin users
    console.log('\n4. Testing platform admin users...');
    
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('role', 'platform_admin');
    
    if (adminError) {
      console.error('❌ Admin users query error:', adminError.message);
    } else {
      console.log('✅ Platform admin users found:', adminUsers?.length || 0);
      if (adminUsers && adminUsers.length > 0) {
        console.log('Admin users:', adminUsers);
      }
    }

    console.log('\n=== API Connection Test Complete ===');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testApiConnection();
