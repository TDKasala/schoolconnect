// Script to generate SQL commands for updating platform admin user
// This script outputs the SQL commands needed to change the platform admin user
// You'll need to run these SQL commands in your Supabase SQL Editor

console.log('To change the platform admin user to landrykasala17@gmail.com, run the following SQL commands in your Supabase SQL Editor:\n');

console.log('-- Step 1: Update the existing testadmin user email and password');
console.log("UPDATE auth.users SET email = 'landrykasala17@gmail.com', encrypted_password = crypt('Raysunkasala2016', gen_salt('bf')) WHERE email = 'testadmin@schoolconnect.com';\n");

console.log('-- Step 2: Update the user profile in the users table');
console.log("UPDATE users SET email = 'landrykasala17@gmail.com' WHERE email = 'testadmin@schoolconnect.com';\n");

console.log('-- Alternative: If you prefer to create a new admin user instead of updating the existing one:');
console.log('-- Step 1: Insert new user into auth.users');
console.log("INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role, aud, confirmation_token, recovery_token, email_change_token_new, email_change)");
console.log("VALUES (gen_random_uuid(), 'landrykasala17@gmail.com', crypt('Raysunkasala2016', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated', '', '', '', '');\n");

console.log('-- Step 2: Insert corresponding profile in users table');
console.log("INSERT INTO users (id, email, role, status, created_at, updated_at)");
console.log("SELECT id, 'landrykasala17@gmail.com', 'platform_admin', 'active', now(), now()");
console.log("FROM auth.users WHERE email = 'landrykasala17@gmail.com';\n");

console.log('-- Step 3: (Optional) Remove old testadmin user');
console.log("DELETE FROM users WHERE email = 'testadmin@schoolconnect.com';");
console.log("DELETE FROM auth.users WHERE email = 'testadmin@schoolconnect.com';\n");

console.log('Note: Choose either the UPDATE approach (simpler) or the INSERT + DELETE approach (cleaner).');
console.log('The UPDATE approach is recommended as it preserves the user ID and any related data.');
