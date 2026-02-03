import { createClient } from '@supabase/supabase-js';

// Access environment variables defined in the .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
