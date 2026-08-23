import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "../../_types/supabase";
import {
  getSupabasePublicConfig,
  getSupabaseServiceRoleKey,
} from "./config";

function createAdminSupabaseClient() {
  const { url } = getSupabasePublicConfig();

  return createClient<Database>(url, getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { createAdminSupabaseClient };
