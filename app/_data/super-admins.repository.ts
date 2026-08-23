import { createClient } from "../_lib/supabase/client";
import { mapSuperAdmin } from "../_lib/supabase/mappers";
import type { SuperAdmin } from "../_types/super-admin";
import { throwIfSupabaseError } from "./supabase-errors";

const getSuperAdmin = async (id: string): Promise<SuperAdmin | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("super_admins")
    .select("*")
    .eq("user_id", id)
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(error);

  if (!data) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "super_admin")
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(profileError);

  return profile
    ? mapSuperAdmin(profile, {
        user_id: id,
        created_at: data.created_at,
        deleted_at: null,
      })
    : null;
};

export { getSuperAdmin };
