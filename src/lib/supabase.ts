import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const receiptsBucket =
  process.env.SUPABASE_RECEIPTS_BUCKET ?? "receipts";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Check .env.local for SUPABASE_URL and SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

export const SUPABASE_RECEIPTS_BUCKET = receiptsBucket;

export async function helloWorldQuery() {
  const { data, error } = await supabase.rpc("hello_world");

  if (error) {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Supabase hello_world RPC failed";
    throw new Error(message);
  }

  return data;
}
