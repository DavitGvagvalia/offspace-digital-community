"use server";

import { nowTimestamp } from "../../_lib/dates";
import { createAdminSupabaseClient } from "../../_lib/supabase/admin";
import { createServerSupabaseClient } from "../../_lib/supabase/server";

type DeleteCurrentStudentAccountResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

async function deleteCurrentStudentAuthAccount(): Promise<DeleteCurrentStudentAccountResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      message: "You must be signed in as a student to delete this account.",
    };
  }

  const admin = createAdminSupabaseClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .eq("role", "student")
    .is("deleted_at", null)
    .maybeSingle();

  if (profileError) {
    return {
      ok: false,
      message: "We could not verify your student profile right now.",
    };
  }

  const { data: student, error: studentError } = await admin
    .from("students")
    .select("user_id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (studentError) {
    return {
      ok: false,
      message: "We could not verify your student profile right now.",
    };
  }

  if (!profile || !student) {
    return {
      ok: false,
      message: "This account does not have an active student profile.",
    };
  }

  const { error: authDeleteError } = await admin.auth.admin.deleteUser(user.id);

  if (authDeleteError) {
    return {
      ok: false,
      message: "We could not delete your Supabase Auth account right now.",
    };
  }

  const deletedAt = nowTimestamp();
  const { error: profileUpdateError } = await admin
    .from("profiles")
    .update({
      deleted_at: deletedAt,
      updated_at: deletedAt,
    })
    .eq("id", user.id)
    .eq("role", "student");

  if (profileUpdateError) {
    console.error(profileUpdateError);
  }

  const { error: studentUpdateError } = await admin
    .from("students")
    .update({ deleted_at: deletedAt })
    .eq("user_id", user.id);

  if (studentUpdateError) {
    console.error(studentUpdateError);
  }

  return { ok: true };
}

export { deleteCurrentStudentAuthAccount };
