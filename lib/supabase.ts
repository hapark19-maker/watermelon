import { createClient } from "@supabase/supabase-js";

export const getSupabaseClient = (customUrl?: string, customKey?: string) => {
  const url = customUrl || (typeof window !== "undefined" ? localStorage.getItem("custom_supabase_url") : null) || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
  const key = customKey || (typeof window !== "undefined" ? localStorage.getItem("custom_supabase_key") : null) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
  return createClient(url, key);
};

export const supabase = getSupabaseClient();
