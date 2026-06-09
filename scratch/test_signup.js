import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
  console.log('Attempting signup...');
  const { data, error } = await supabase.auth.signUp({
    email: 'test_trigger_error_123@example.com',
    password: 'testPassword123!',
  });

  if (error) {
    console.error('Signup error:', error);
  } else {
    console.log('Signup successful:', data.user?.id);
  }
}

testSignup();
