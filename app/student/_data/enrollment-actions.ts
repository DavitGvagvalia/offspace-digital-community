"use server";

import { createAdminSupabaseClient } from "../../_lib/supabase/admin";
import { createServerSupabaseClient } from "../../_lib/supabase/server";
import { nowTimestamp } from "../../_lib/dates";
import { mapEnrollment } from "../../_lib/supabase/mappers";
import type { Enrollment } from "../../_types/enrollment";

async function assertCurrentUserIsStudent() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in as a student.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .eq("role", "student")
    .is("deleted_at", null)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("This account does not have student access.");
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("user_id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (studentError || !student) {
    throw new Error("This account does not have a student profile.");
  }

  return user.id;
}

async function enrollCurrentStudentInCourses(
  courseIds: string[],
): Promise<Enrollment[]> {
  const studentId = await assertCurrentUserIsStudent();
  const uniqueCourseIds = [...new Set(courseIds.filter(Boolean))];

  if (uniqueCourseIds.length === 0) {
    return [];
  }

  const admin = createAdminSupabaseClient();
  const { data: activeCourses, error: coursesError } = await admin
    .from("courses")
    .select("id")
    .in("id", uniqueCourseIds)
    .eq("active", true)
    .is("deleted_at", null);

  if (coursesError) {
    throw coursesError;
  }

  if ((activeCourses ?? []).length !== uniqueCourseIds.length) {
    throw new Error("Only active courses can be selected.");
  }

  const { data: currentEnrollments, error: currentEnrollmentsError } =
    await admin
      .from("enrollments")
      .select("*")
      .eq("student_id", studentId)
      .is("deleted_at", null);

  if (currentEnrollmentsError) {
    throw currentEnrollmentsError;
  }

  if ((currentEnrollments ?? []).length > 0) {
    return (currentEnrollments ?? []).map(mapEnrollment);
  }

  const timestamp = nowTimestamp();
  const { data: createdEnrollments, error: enrollmentError } = await admin
    .from("enrollments")
    .upsert(
      uniqueCourseIds.map((courseId) => ({
        student_id: studentId,
        course_id: courseId,
        group_id: null,
        mentor_id: null,
        price: null,
        status: "active" as const,
        completed_at: null,
        updated_at: timestamp,
        deleted_at: null,
      })),
      { onConflict: "student_id,course_id" },
    )
    .select();

  if (enrollmentError) {
    throw enrollmentError;
  }

  return (createdEnrollments ?? []).map(mapEnrollment);
}

export { enrollCurrentStudentInCourses };
