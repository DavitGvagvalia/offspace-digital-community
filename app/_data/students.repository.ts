import { createClient } from "../_lib/supabase/client";
import { nowTimestamp } from "../_lib/dates";
import { mapStudent } from "../_lib/supabase/mappers";
import type { CreateStudent } from "../_types/student";
import { requireSupabaseData, throwIfSupabaseError } from "./supabase-errors";

const getStudents = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .is("deleted_at", null)
    .order("last_name");

  throwIfSupabaseError(error);

  return (data ?? []).map(mapStudent);
};

const getStudent = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "student")
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(error);

  return data ? mapStudent(data) : null;
};

const addStudent = async (student: CreateStudent) => {
  void student;
  throw new Error(
    "Students must be created through Supabase Auth by a super-admin.",
  );
};

const addStudentWithId = async (id: string, student: CreateStudent) => {
  const supabase = createClient();
  const { error: profileError } = await supabase.from("profiles").insert({
    id,
    role: "student",
    name: student.name,
    last_name: student.lastName,
    email: student.email ?? null,
    phone: student.phone ?? null,
  });

  throwIfSupabaseError(profileError);

  const { error: studentError } = await supabase
    .from("students")
    .insert({ user_id: id });

  throwIfSupabaseError(studentError);

  const created = await getStudent(id);

  if (!created) {
    throw new Error("Created student profile could not be loaded.");
  }

  return created;
};

const updateStudent = async (id: string, student: Partial<CreateStudent>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...(student.name !== undefined ? { name: student.name } : {}),
      ...(student.lastName !== undefined ? { last_name: student.lastName } : {}),
      ...(student.email !== undefined ? { email: student.email } : {}),
      ...(student.phone !== undefined ? { phone: student.phone } : {}),
      updated_at: nowTimestamp(),
    })
    .eq("id", id)
    .eq("role", "student")
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapStudent(requireSupabaseData(data));
};

const deleteStudent = async (id: string) => {
  const supabase = createClient();
  const deletedAt = nowTimestamp();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ deleted_at: deletedAt })
    .eq("id", id)
    .eq("role", "student");

  throwIfSupabaseError(profileError);

  const { error: studentError } = await supabase
    .from("students")
    .update({ deleted_at: deletedAt })
    .eq("user_id", id);

  throwIfSupabaseError(studentError);
};

export {
  addStudent,
  addStudentWithId,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
};
