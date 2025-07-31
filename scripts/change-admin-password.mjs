// Script to generate SQL command for changing admin password
// This script outputs the SQL command needed to update the password
// You'll need to run this SQL command in your Supabase SQL Editor

console.log('To change the password for testadmin@schoolconnect.com, run the following SQL command in your Supabase SQL Editor:\n');
console.log("UPDATE auth.users SET encrypted_password = crypt('@Analyse123!', gen_salt('bf')) WHERE email = 'testadmin@schoolconnect.com';\n");
console.log('Note: This will update the password for the user in the auth schema.');
