import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "../../_types/supabase";
import { getSupabasePublicConfig } from "./config";

async function createServerSupabaseClient() {
  const { url, publishableKey } = getSupabasePublicConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options: Parameters<typeof cookieStore.set>[2];
        }>,
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot always write cookies. Middleware can refresh
          // sessions later; mutations still write from Server Actions.
        }
      },
    },
  });
}

export { createServerSupabaseClient };
