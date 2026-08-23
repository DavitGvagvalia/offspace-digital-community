"use server";

import { createAdminSupabaseClient } from "../../_lib/supabase/admin";
import { mapMentor, mapStudent } from "../../_lib/supabase/mappers";
import { createServerSupabaseClient } from "../../_lib/supabase/server";
import type { Mentor } from "../../_types/mentor";
import type { Student } from "../../_types/student";

type StudentAuthInput = {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone?: string;
};

type StudentAuthCreationResult = {
  student: Student;
  uid: string;
  email: string;
};

type MentorAuthInput = StudentAuthInput & {
  active?: boolean;
};

type MentorAuthCreationResult = {
  mentor: Mentor;
  uid: string;
  email: string;
};

async function assertCurrentUserIsSuperAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in as a super-admin.");
  }

  const { data, error } = await supabase
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    throw new Error("This account does not have permission to manage users.");
  }
}

async function createStudentAuthAndProfile({
  email,
  password,
  name,
  lastName,
  phone,
}: StudentAuthInput): Promise<StudentAuthCreationResult> {
  await assertCurrentUserIsSuperAdmin();

  const admin = createAdminSupabaseClient();
  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "student" },
      user_metadata: { name, lastName },
    });

  if (authError || !authData.user) {
    throw authError ?? new Error("Supabase did not return a created user.");
  }

  const uid = authData.user.id;

  try {
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .insert({
        id: uid,
        role: "student",
        name,
        last_name: lastName,
        email,
        phone: phone ?? null,
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    const { error: studentError } = await admin
      .from("students")
      .insert({ user_id: uid });

    if (studentError) {
      throw studentError;
    }

    return {
      student: mapStudent(profile),
      uid,
      email,
    };
  } catch (profileError) {
    await admin.auth.admin.deleteUser(uid);
    throw profileError;
  }
}

async function createMentorAuthAndProfile({
  email,
  password,
  name,
  lastName,
  phone,
  active = true,
}: MentorAuthInput): Promise<MentorAuthCreationResult> {
  await assertCurrentUserIsSuperAdmin();

  const admin = createAdminSupabaseClient();
  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "mentor" },
      user_metadata: { name, lastName },
    });

  if (authError || !authData.user) {
    throw authError ?? new Error("Supabase did not return a created user.");
  }

  const uid = authData.user.id;

  try {
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .insert({
        id: uid,
        role: "mentor",
        name,
        last_name: lastName,
        email,
        phone: phone ?? null,
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    const { error: mentorError } = await admin
      .from("mentors")
      .insert({ user_id: uid, active });

    if (mentorError) {
      throw mentorError;
    }

    return {
      mentor: mapMentor(profile, { active }),
      uid,
      email,
    };
  } catch (profileError) {
    await admin.auth.admin.deleteUser(uid);
    throw profileError;
  }
}

export {
  createMentorAuthAndProfile,
  createStudentAuthAndProfile,
  type MentorAuthCreationResult,
  type MentorAuthInput,
  type StudentAuthCreationResult,
  type StudentAuthInput,
};
