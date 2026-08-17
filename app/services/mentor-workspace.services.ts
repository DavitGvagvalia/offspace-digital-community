import type { MentorGroupWorkspace } from "../types/mentor-workspace.types";
import type { Lesson } from "../types/lesson.types";
import type { Student } from "../types/student.types";
import { getCourse } from "./courses.services";
import { getLessons } from "./lessons.services";
import {
  getAttendancesByGroup,
  getEnrollmentsByGroup,
  getGroupsByMentor,
} from "./queries.services";
import { getStudent } from "./students.services";

export async function getMentorGroupWorkspaces(
  mentorId: string,
): Promise<MentorGroupWorkspace[]> {
  const groups = await getGroupsByMentor(mentorId);

  return Promise.all(
    groups.map(async (group) => {
      const [course, lessons, enrollments, attendances] = await Promise.all([
        getCourse(group.courseId),
        getLessons(group.courseId, group.id),
        getEnrollmentsByGroup(group.id),
        getAttendancesByGroup(group.id),
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
