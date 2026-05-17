import { createClient } from "@supabase/supabase-js";

// Anon key is public by design — safe to use as fallback for builds without ARG injection.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://gtmwwacjizmmceemmnzd.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0bXd3YWNqaXptbWNlZW1tbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTEzMDIsImV4cCI6MjA5MzkyNzMwMn0.Xk4kxcVDxKKr0KQX-2uk3SBC_YYSaEpFU2K0IR6nKTU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
