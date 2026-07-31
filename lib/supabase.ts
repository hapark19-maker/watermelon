import { createClient } from "@supabase/supabase-js";

// Supabase project 'supabase-rose-book' (haxffmxrfmrhrwfhybbj) credentials
const DEFAULT_SUPABASE_URL = "https://haxffmxrfmrhrwfhybbj.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheGZmbXhyZm1yaHJ3Zmh5YmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Njk2NzMsImV4cCI6MjEwMTA0NTY3M30.U186SokO5udll2NBJfPCtmqW7QpAwl5ty8uETpiDK6w";

export const getSupabaseClient = (customUrl?: string, customKey?: string) => {
  const url = customUrl || (typeof window !== "undefined" ? localStorage.getItem("custom_supabase_url") : null) || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = customKey || (typeof window !== "undefined" ? localStorage.getItem("custom_supabase_key") : null) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  return createClient(url, key);
};

export const supabase = getSupabaseClient();
