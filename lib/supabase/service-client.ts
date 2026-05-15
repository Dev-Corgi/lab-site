import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** 서버에서만 사용. 배포 환경에 SUPABASE_SERVICE_ROLE_KEY가 없으면 null. */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
