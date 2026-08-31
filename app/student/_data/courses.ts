import { getCourse } from "../../_data/courses.repository";
import { getGroup } from "../../_data/groups.repository";
import { getEnrollmentsByStudent } from "../../_data/queries.repository";
import { createClient } from "../../_lib/supabase/client";
import type { StudentCourseSummary } from "../_types/course-summary";
import { throwIfSupabaseError } from "../../_data/supabase-errors";

export async function getStudentCourseSummaries(
  studentId: string,
): Promise<StudentCourseSummary[]> {
  const enrollments = await getEnrollmentsByStudent(studentId);
  const mentorById = await getStudentEnrollmentMentorMap();

  return Promise.all(
    enrollments.map(async (enrollment) => {
      const [course, group] = await Promise.all([
        getCourse(enrollment.courseId),
        enrollment.groupId
          ? getGroup(enrollment.courseId, enrollment.groupId)
          : Promise.resolve(null),
      ]);

      return {
        enrollment,
        course,
        group,
        mentor: enrollment.mentorId
          ? (mentorById.get(enrollment.mentorId) ?? null)
          : null,
      };
    }),
  );
}

async function getStudentEnrollmentMentorMap() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_my_enrollment_mentors");

  throwIfSupabaseError(error);

  return new Map(
    (data ?? []).map((mentor) => [
      mentor.mentor_id,
      {
        id: mentor.mentor_id,
        name: mentor.name,
        lastName: mentor.last_name,
      },
    ]),
  );
}
