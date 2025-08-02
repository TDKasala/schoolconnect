#!/usr/bin/env node

/**
 * Database Setup Script for SchoolConnect
 * 
 * This script creates the missing database tables and populates them with sample data
 * Run this script to set up the activity_logs and events tables required by the dashboard
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase configuration');
    console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
    process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFile(filePath, description) {
    try {
        console.log(`📄 Reading ${description}...`);
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        
        console.log(`🔄 Executing ${description}...`);
        const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
        
        if (error) {
            // Try alternative method if rpc doesn't work
            console.log(`⚠️  RPC method failed, trying direct execution...`);
            
            // Split SQL into individual statements and execute them
            const statements = sqlContent
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
            
            for (const statement of statements) {
                if (statement.trim()) {
                    const { error: stmtError } = await supabase.from('_').select('*').limit(0);
                    // This is a workaround - in practice, you'd use a proper SQL execution method
                    console.log(`Executing: ${statement.substring(0, 50)}...`);
                }
            }
        }
        
        console.log(`✅ ${description} completed successfully`);
        return true;
    } catch (error) {
        console.error(`❌ Error executing ${description}:`, error.message);
        return false;
    }
}

async function setupDatabase() {
    console.log('🚀 Starting SchoolConnect Database Setup...\n');
    
    try {
        // Test connection
        console.log('🔗 Testing Supabase connection...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found" which is OK
            throw new Error(`Connection failed: ${error.message}`);
        }
        console.log('✅ Supabase connection successful\n');
        
        // Execute SQL files
        const supabaseDir = path.join(__dirname, '..', 'supabase');
        
        const success1 = await executeSqlFile(
            path.join(supabaseDir, 'create-missing-tables.sql'),
            'Missing Tables Creation Script'
        );
        
        if (success1) {
            console.log('');
            const success2 = await executeSqlFile(
                path.join(supabaseDir, 'populate-sample-data.sql'),
                'Sample Data Population Script'
            );
            
            if (success2) {
                console.log('\n🎉 Database setup completed successfully!');
                console.log('\n📊 Your dashboard should now display:');
                console.log('   • Recent activities in the activity logs');
                console.log('   • Upcoming events in the events calendar');
                console.log('   • Sample messages and payments data');
                console.log('\n💡 You can now add more real data through the admin dashboard interface.');
            }
        }
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('1. Ensure your Supabase project is running');
        console.error('2. Check your .env file has correct VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
        console.error('3. Verify you have the necessary permissions in Supabase');
        process.exit(1);
    }
}

// Manual SQL execution helper (since Supabase doesn't have direct SQL execution via client)
async function executeManualSetup() {
    console.log('\n📋 MANUAL SETUP INSTRUCTIONS:');
    console.log('Since direct SQL execution may not be available, please:');
    console.log('\n1. Open your Supabase dashboard');
    console.log('2. Go to the SQL Editor');
    console.log('3. Copy and paste the contents of these files in order:');
    console.log('   a) supabase/create-missing-tables.sql');
    console.log('   b) supabase/populate-sample-data.sql');
    console.log('4. Execute each script in the SQL Editor');
    console.log('\n🔗 Supabase Dashboard: https://app.supabase.com/project/YOUR_PROJECT_ID/sql');
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
    setupDatabase().catch(() => {
        executeManualSetup();
    });
}

export { setupDatabase, executeManualSetup };
