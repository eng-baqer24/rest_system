import { createClient } from "@supabase/supabase-js";

function cleanEnvString(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']+|["']+$/g, "").trim();
}

const supabaseUrl =
  cleanEnvString(process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://placeholder.supabase.co";

const supabaseAnonKey =
  cleanEnvString(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  cleanEnvString(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  cleanEnvString(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) ||
  "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

