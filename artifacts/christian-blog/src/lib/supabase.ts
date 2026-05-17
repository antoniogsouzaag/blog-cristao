import { createClient } from "@supabase/supabase-js";

// VITE_* vars are baked in at build time by Vite.
// In Docker: injected via ARG defaults in Dockerfile (project pdkzkkwbawnrkadooemg).
// In local dev: read from .env.local.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
