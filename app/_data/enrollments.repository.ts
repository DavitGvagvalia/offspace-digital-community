import type { CreateEnrollment } from "../_types/enrollment";
import { nowTimestamp } from "../_lib/dates";
import { createClient } from "../_lib/supabase/client";
import { mapEnrollment } from "../_lib/supabase/mappers";
import { requireSupabaseData, throwIfSupabaseError } from "./supabase-errors";

type UpdateEnrollment = Partial<
  Omit<CreateEnrollment, "groupId" | "mentorId" | "completedAt">
> & {
  groupId?: string | null;
  mentorId?: string | null;
  completedAt?: string | null;
};

const getEnrollments = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .is("deleted_at", null);

  throwIfSupabaseError(error);

  return (data ?? []).map(mapEnrollment);
};

const getEnrollment = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(error);

  return data ? mapEnrollment(data) : null;
};

const addEnrollment = async (enrollment: CreateEnrollment) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      student_id: enrollment.studentId,
      course_id: enrollment.courseId,
      group_id: enrollment.groupId ?? null,
      mentor_id: enrollment.mentorId ?? null,
      price: enrollment.price ?? null,
      status: enrollment.status,
      completed_at: enrollment.completedAt ?? null,
    })
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapEnrollment(requireSupabaseData(data));
};

const updateEnrollment = async (
  id: string,
  enrollment: UpdateEnrollment,
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .update({
      ...(enrollment.studentId !== undefined
        ? { student_id: enrollment.studentId }
        : {}),
      ...(enrollment.courseId !== undefined
        ? { course_id: enrollment.courseId }
        : {}),
      ...(enrollment.groupId !== undefined ? { group_id: enrollment.groupId } : {}),
      ...(enrollment.mentorId !== undefined
        ? { mentor_id: enrollment.mentorId }
        : {}),
      ...(enrollment.price !== undefined ? { price: enrollment.price } : {}),
      ...(enrollment.status !== undefined ? { status: enrollment.status } : {}),
      ...(enrollment.completedAt !== undefined
        ? { completed_at: enrollment.completedAt }
        : {}),
      updated_at: nowTimestamp(),
    })
    .eq("id", id)
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapEnrollment(requireSupabaseData(data));
};

const deleteEnrollment = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("enrollments")
    .update({ deleted_at: nowTimestamp() })
    .eq("id", id);

  throwIfSupabaseError(error);
};

export {
  addEnrollment,
  deleteEnrollment,
  getEnrollment,
  getEnrollments,
  updateEnrollment,
};
