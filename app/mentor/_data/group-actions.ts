"use server";

import { createAdminSupabaseClient } from "../../_lib/supabase/admin";
import { createServerSupabaseClient } from "../../_lib/supabase/server";
import { nowTimestamp } from "../../_lib/dates";
import { mapGroup } from "../../_lib/supabase/mappers";
import type { Group } from "../../_types/group";

type CreateMentorGroupInput = {
  courseId: string;
  name?: string;
  enrollmentIds?: string[];
};

async function assertCurrentUserIsActiveMentor() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in as a mentor.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .eq("role", "mentor")
    .is("deleted_at", null)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("This account does not have mentor access.");
  }

  const { data: mentor, error: mentorError } = await supabase
    .from("mentors")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (mentorError || !mentor) {
    throw new Error("This mentor account is not active.");
  }

  return user.id;
}

async function createMentorGroup({
  courseId,
  name,
  enrollmentIds = [],
}: CreateMentorGroupInput): Promise<Group> {
  const mentorId = await assertCurrentUserIsActiveMentor();
  const trimmedCourseId = courseId.trim();
  const trimmedName = name?.trim();
  const uniqueEnrollmentIds = [...new Set(enrollmentIds.filter(Boolean))];

  if (!trimmedCourseId) {
    throw new Error("Choose a course before creating a group.");
  }

  const admin = createAdminSupabaseClient();
  const { data: eligibility, error: eligibilityError } = await admin
    .from("course_mentor_eligibility")
    .select("course_id")
    .eq("course_id", trimmedCourseId)
    .eq("mentor_id", mentorId)
    .is("deleted_at", null)
    .maybeSingle();

  if (eligibilityError || !eligibility) {
    throw new Error("This course is not assigned to your mentor account.");
  }

  const { data: course, error: courseError } = await admin
    .from("courses")
    .select("id")
    .eq("id", trimmedCourseId)
    .eq("active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (courseError || !course) {
    throw new Error("This course is not active.");
  }

  const { data: createdGroup, error: groupError } = await admin
    .from("groups")
    .insert({
      course_id: trimmedCourseId,
      mentor_id: mentorId,
      name: trimmedName || null,
      active: true,
    })
    .select()
    .single();

  if (groupError || !createdGroup) {
    throw groupError ?? new Error("Supabase did not return a created group.");
  }

  try {
    if (uniqueEnrollmentIds.length > 0) {
      const { data: enrollments, error: enrollmentsError } = await admin
        .from("enrollments")
        .select("id")
        .in("id", uniqueEnrollmentIds)
        .eq("course_id", trimmedCourseId)
        .eq("status", "active")
        .is("group_id", null)
        .is("mentor_id", null)
        .is("deleted_at", null);

      if (enrollmentsError) {
        throw enrollmentsError;
      }

      if ((enrollments ?? []).length !== uniqueEnrollmentIds.length) {
        throw new Error("One or more selected students cannot be assigned.");
      }

      const { error: updateError } = await admin
        .from("enrollments")
        .update({
          group_id: createdGroup.id,
          mentor_id: mentorId,
          updated_at: nowTimestamp(),
        })
        .in("id", uniqueEnrollmentIds);

      if (updateError) {
        throw updateError;
      }
    }

    return mapGroup(createdGroup);
  } catch (assignmentError) {
    await admin
      .from("groups")
      .update({ deleted_at: nowTimestamp() })
      .eq("id", createdGroup.id);

    throw assignmentError;
  }
}

export { createMentorGroup, type CreateMentorGroupInput };
