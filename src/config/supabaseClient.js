import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ngukguvinzmbnnhngctr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ndWtndXZpbnptYm5uaG5nY3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0ODY0MDQsImV4cCI6MjA4NjA2MjQwNH0.g6qfGwOxKfJPXJdl4vCF2T0qoeE4ougbcich6xk5uM8'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase