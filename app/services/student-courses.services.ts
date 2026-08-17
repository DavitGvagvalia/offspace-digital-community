import type { StudentCourseSummary } from "../types/student-course-summary.types";
import { getCourse } from "./courses.services";
import { getGroup } from "./groups.services";
import { getMentor } from "./mentors.services";
import { getEnrollmentsByStudent } from "./queries.services";

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
