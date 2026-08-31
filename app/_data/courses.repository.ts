import { createClient } from "../_lib/supabase/client";
import { nowTimestamp } from "../_lib/dates";
import { mapCourse } from "../_lib/supabase/mappers";
import type { CreateCourse } from "../_types/course";
import { requireSupabaseData, throwIfSupabaseError } from "./supabase-errors";

async function getCourseMentorIds(courseId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("course_mentor_eligibility")
    .select("mentor_id")
    .eq("course_id", courseId)
    .is("deleted_at", null);

  throwIfSupabaseError(error);

  return (data ?? []).map((row) => row.mentor_id);
}

const getCourses = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .is("deleted_at", null)
    .order("name");

  throwIfSupabaseError(error);

  return Promise.all(
    (data ?? []).map(async (course) =>
      mapCourse(course, await getCourseMentorIds(course.id)),
    ),
  );
};

const getActiveCourses = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("active", true)
    .is("deleted_at", null)
    .order("name");

  throwIfSupabaseError(error);

  return Promise.all(
    (data ?? []).map(async (course) =>
      mapCourse(course, await getCourseMentorIds(course.id)),
    ),
  );
};

const getCourse = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  throwIfSupabaseError(error);

  return data ? mapCourse(data, await getCourseMentorIds(data.id)) : null;
};

const addCourse = async (course: CreateCourse) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .insert({
      name: course.name,
      description: course.description ?? null,
      price: course.price ?? null,
      active: course.active,
    })
    .select()
    .single();

  throwIfSupabaseError(error);
  const createdCourse = requireSupabaseData(data);

  if (course.mentorIds?.length) {
    const { error: eligibilityError } = await supabase
      .from("course_mentor_eligibility")
      .insert(
        course.mentorIds.map((mentorId) => ({
          course_id: createdCourse.id,
          mentor_id: mentorId,
        })),
      );

    throwIfSupabaseError(eligibilityError);
  }

  return mapCourse(createdCourse, course.mentorIds ?? []);
};

const updateCourse = async (id: string, course: Partial<CreateCourse>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .update({
      ...(course.name !== undefined ? { name: course.name } : {}),
      ...(course.description !== undefined
        ? { description: course.description }
        : {}),
      ...(course.price !== undefined ? { price: course.price } : {}),
      ...(course.active !== undefined ? { active: course.active } : {}),
      updated_at: nowTimestamp(),
    })
    .eq("id", id)
    .select()
    .single();

  throwIfSupabaseError(error);

  if (course.mentorIds) {
    const { error: deleteError } = await supabase
      .from("course_mentor_eligibility")
      .update({ deleted_at: nowTimestamp() })
      .eq("course_id", id);

    throwIfSupabaseError(deleteError);

    if (course.mentorIds.length > 0) {
      const { error: insertError } = await supabase
        .from("course_mentor_eligibility")
        .upsert(
          course.mentorIds.map((mentorId) => ({
            course_id: id,
            mentor_id: mentorId,
            deleted_at: null,
          })),
        );

      throwIfSupabaseError(insertError);
    }
  }

  return mapCourse(
    requireSupabaseData(data),
    course.mentorIds ?? (await getCourseMentorIds(id)),
  );
};

const deleteCourse = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("courses")
    .update({ deleted_at: nowTimestamp() })
    .eq("id", id);

  throwIfSupabaseError(error);
};

const getPrivateStudents = async (courseId: string) => {
  void courseId;
  return [];
};

const getPrivateStudent = async (courseId: string, studentId: string) => {
  void courseId;
  void studentId;
  return null;
};

export {
  addCourse,
  deleteCourse,
  getActiveCourses,
  getCourse,
  getCourses,
  getPrivateStudent,
  getPrivateStudents,
  updateCourse,
};
