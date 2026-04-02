import supabase from "../src/config/supabaseClient.js";

supabase.auth.signInWithOAuth({
    provider: 'apple'
})