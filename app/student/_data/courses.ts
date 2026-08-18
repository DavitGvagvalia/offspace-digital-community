import { getCourse } from "../../_data/courses.repository";
import { getGroup } from "../../_data/groups.repository";
import { getMentor } from "../../_data/mentors.repository";
import { getEnrollmentsByStudent } from "../../_data/queries.repository";
import type { StudentCourseSummary } from "../_types/course-summary";

export async function getStudentCourseSummaries(
  studentId: string,
): Promise<StudentCourseSummary[]> {
  const enrollments = await getEnrollmentsByStudent(studentId);

  return Promise.all(
    enrollments.map(async (enrollment) => {
      const [course, group, mentor] = await Promise.all([
        getCourse(enrollment.courseId),
        getGroup(enrollment.courseId, enrollment.groupId),
        getMentor(enrollment.mentorId),
      ]);

      return {
        enrollment,
        course,
        group,
        mentor,
      };
    }),
  );
}
