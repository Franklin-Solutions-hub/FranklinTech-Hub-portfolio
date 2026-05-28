require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testLogin(email, password) {
  console.log(`\nTesting login for: ${email}`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.log(`❌ Error: ${error.message}`);
  } else {
    console.log(`✅ Success! User ID: ${data.user.id}`);
  }
}

async function run() {
  await testLogin('Franklintechhubsolutions@gmail.com', 'Fragamah@12');
  await testLogin('Franklintechhub@gmail.com', 'Fragamah@12');
  await testLogin('admin@franklintechhub.com', 'Fragamah@12');
  await testLogin('Franklintechhub', 'Fragamah@12');
  console.log('\n--- Test finished ---');
}

run();
