import { createClient } from "@supabase/supabase-js";

// Anon key is public by design — safe to use as fallback for builds without ARG injection.
// Project: pdkzkkwbawnrkadooemg — update VITE_SUPABASE_ANON_KEY build arg if key changes.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://pdkzkkwbawnrkadooemg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "COLE_AQUI_A_ANON_KEY_DO_NOVO_PROJETO";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
