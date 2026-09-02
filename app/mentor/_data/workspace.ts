import { getCourse } from "../../_data/courses.repository";
import { getLessons } from "../../_data/lessons.repository";
import {
  getAttendancesByGroup,
  getEnrollmentsByAssignedGroup,
  getGroupsByMentor,
} from "../../_data/queries.repository";
import { getStudent } from "../../_data/students.repository";
import { toMillis } from "../../_lib/dates";
import type { Lesson } from "../../_types/lesson";
import type {
  MentorEnrollmentStudent,
  MentorGroupWorkspace,
} from "../_types/workspace";

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
      const enrollmentStudents = enrollments.reduce<MentorEnrollmentStudent[]>(
        (items, enrollment, index) => {
          const student = students[index];

          if (student) {
            items.push({ enrollment, student });
          }

          return items;
        },
        [],
      );

      return {
        group,
        course,
        lessons: sortLessons(lessons),
        enrollmentStudents,
        students: enrollmentStudents.map((item) => item.student),
        attendances,
      };
    }),
  );
}

function sortLessons(lessons: Lesson[]) {
  return [...lessons].sort((firstLesson, secondLesson) => {
    return toMillis(firstLesson.date) - toMillis(secondLesson.date);
  });
}
