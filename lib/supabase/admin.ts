import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Uses the Supabase secret key — bypasses RLS entirely. Never import this
 * from a Client Component or expose SUPABASE_SECRET_KEY with a NEXT_PUBLIC_
 * prefix. Reserved for trusted server-to-server contexts (e.g. the SePay
 * webhook route), which authenticate the caller by other means.
 */
export function createAdminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
