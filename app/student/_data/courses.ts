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
        enrollment.groupId
          ? getGroup(enrollment.courseId, enrollment.groupId)
          : Promise.resolve(null),
        enrollment.mentorId ? getMentor(enrollment.mentorId) : Promise.resolve(null),
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
