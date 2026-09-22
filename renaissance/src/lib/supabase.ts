import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/config";

const env = getSupabaseEnv();

export const supabase = env
  ? createSupabaseClient(env.url, env.key)
  : null!;

export { createClient as createBrowserClient } from "@/lib/supabase/client";
