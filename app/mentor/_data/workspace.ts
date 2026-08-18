import { getCourse } from "../../_data/courses.repository";
import { getLessons } from "../../_data/lessons.repository";
import {
  getAttendancesByGroup,
  getEnrollmentsByAssignedGroup,
  getGroupsByMentor,
} from "../../_data/queries.repository";
import { getStudent } from "../../_data/students.repository";
import type { Lesson } from "../../_types/lesson";
import type { Student } from "../../_types/student";
import type { MentorGroupWorkspace } from "../_types/workspace";

export async function getMentorGroupWorkspaces(
  mentorId: string,
): Promise<MentorGroupWorkspace[]> {
  const groups = await getGroupsByMentor(mentorId);

  return Promise.all(
    groups.map(async (group) => {
      const [course, lessons, enrollments, attendances] = await Promise.all([
        getCourse(group.courseId),
        getLessons(group.courseId, group.id),
        getEnrollmentsByAssignedGroup(group.courseId, group.id, group.mentorId),
        getAttendancesByGroup(group.courseId, group.id),
      ]);
      const students = await Promise.all(
        enrollments.map((enrollment) => getStudent(enrollment.studentId)),
      );

      return {
        group,
        course,
        lessons: sortLessons(lessons),
        students: students.filter(
          (student): student is Student => Boolean(student),
        ),
        attendances,
      };
    }),
  );
}

function sortLessons(lessons: Lesson[]) {
  return [...lessons].sort((firstLesson, secondLesson) => {
    return firstLesson.date.toMillis() - secondLesson.date.toMillis();
  });
}
