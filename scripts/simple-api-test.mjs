// Simple API test to verify RLS fix
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://urtsvqedsewswknyxvnw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydHN2cWVkc2V3c3drbnl4dm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTgzMTYsImV4cCI6MjA2OTAzNDMxNn0.0u-JwSKSisSH1elVir0tsrbPwPmg4OK-Hn6eenjjAjc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    
    // Test count queries
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    console.log('Total users:', userCount || 0);
    
    const { count: schoolCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true });
    
    console.log('Total schools:', schoolCount || 0);
    
    return true;
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    return false;
  }
}

testConnection();
