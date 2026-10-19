
const SUPABASE_URL = "https://zryeqcmbmfojvjwkcqlp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_O60CtLqjvMU6o-xUuRWF9g_mU_OIcny";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

window.taallamSupabase = supabaseClient;