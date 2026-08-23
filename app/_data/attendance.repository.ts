import { nowTimestamp } from "../_lib/dates";
import { createClient } from "../_lib/supabase/client";
import { mapAttendance } from "../_lib/supabase/mappers";
import type { CreateAttendance } from "../_types/attendance";
import { requireSupabaseData, throwIfSupabaseError } from "./supabase-errors";

const getAttendances = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendances")
    .select("*")
    .is("deleted_at", null);

  throwIfSupabaseError(error);

  return (data ?? []).map(mapAttendance);
};

const getAttendance = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendances")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(error);

  return data ? mapAttendance(data) : null;
};

const addAttendance = async (attendance: CreateAttendance) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendances")
    .upsert(
      {
        student_id: attendance.studentId,
        course_id: attendance.courseId,
        group_id: attendance.groupId,
        lesson_id: attendance.lessonId,
        attended_at: nowTimestamp(),
        deleted_at: null,
      },
      { onConflict: "student_id,lesson_id" },
    )
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapAttendance(requireSupabaseData(data));
};

const updateAttendance = async (
  id: string,
  attendance: Partial<CreateAttendance>,
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendances")
    .update({
      ...(attendance.studentId !== undefined
        ? { student_id: attendance.studentId }
        : {}),
      ...(attendance.courseId !== undefined
        ? { course_id: attendance.courseId }
        : {}),
      ...(attendance.groupId !== undefined ? { group_id: attendance.groupId } : {}),
      ...(attendance.lessonId !== undefined
        ? { lesson_id: attendance.lessonId }
        : {}),
    })
    .eq("id", id)
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapAttendance(requireSupabaseData(data));
};

const deleteAttendance = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("attendances")
    .update({ deleted_at: nowTimestamp() })
    .eq("id", id);

  throwIfSupabaseError(error);
};

export {
  addAttendance,
  deleteAttendance,
  getAttendance,
  getAttendances,
  updateAttendance,
};
