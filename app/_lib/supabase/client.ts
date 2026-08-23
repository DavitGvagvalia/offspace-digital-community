"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "../../_types/supabase";
import { getSupabasePublicConfig } from "./config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

function createClient() {
  const { url, publishableKey } = getSupabasePublicConfig();

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(url, publishableKey);
  }

  return browserClient;
}

export { createClient };
