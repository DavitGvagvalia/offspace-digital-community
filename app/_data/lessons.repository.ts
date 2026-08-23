import { nowTimestamp } from "../_lib/dates";
import { createClient } from "../_lib/supabase/client";
import { mapLesson } from "../_lib/supabase/mappers";
import type { CreateLesson } from "../_types/lesson";
import { requireSupabaseData, throwIfSupabaseError } from "./supabase-errors";

const getLessons = async (courseId: string, groupId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .is("deleted_at", null)
    .order("lesson_at");

  throwIfSupabaseError(error);

  return (data ?? []).map(mapLesson);
};

const getLesson = async (courseId: string, groupId: string, id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(error);

  return data ? mapLesson(data) : null;
};

const addLesson = async (lesson: CreateLesson) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      course_id: lesson.courseId,
      group_id: lesson.groupId,
      title: lesson.title ?? null,
      description: lesson.description ?? null,
      lesson_at: lesson.date,
    })
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapLesson(requireSupabaseData(data));
};

const updateLesson = async (
  courseId: string,
  groupId: string,
  id: string,
  lesson: Partial<CreateLesson>,
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .update({
      ...(lesson.courseId !== undefined ? { course_id: lesson.courseId } : {}),
      ...(lesson.groupId !== undefined ? { group_id: lesson.groupId } : {}),
      ...(lesson.title !== undefined ? { title: lesson.title } : {}),
      ...(lesson.description !== undefined
        ? { description: lesson.description }
        : {}),
      ...(lesson.date !== undefined ? { lesson_at: lesson.date } : {}),
      updated_at: nowTimestamp(),
    })
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .eq("id", id)
    .select()
    .single();

  throwIfSupabaseError(error);

  return mapLesson(requireSupabaseData(data));
};

const deleteLesson = async (courseId: string, groupId: string, id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("lessons")
    .update({ deleted_at: nowTimestamp() })
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .eq("id", id);

  throwIfSupabaseError(error);
};

export {
  addLesson,
  deleteLesson,
  getLesson,
  getLessons,
  updateLesson,
};
