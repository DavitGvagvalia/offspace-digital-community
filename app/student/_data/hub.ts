import { toMillis } from "../../_lib/dates";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
import type { StudentLesson } from "../_types/lessons";
import { getStudentLessonCourses } from "./lessons";

export type StudentHubLesson = StudentLesson & {
  course: Course;
  enrollment: Enrollment;
};

export type StudentHubState = {
  nextLesson: StudentHubLesson | null;
  missedLessons: StudentHubLesson[];
};

export async function getStudentHubState(
  studentId: string,
): Promise<StudentHubState> {
  const studentCourses = await getStudentLessonCourses(studentId, {
    includeFutureLessons: true,
  });
  const now = Date.now();
  const hubLessons = studentCourses.flatMap((studentCourse) =>
    studentCourse.lessons.map((lesson) => ({
      ...lesson,
      course: studentCourse.course,
      enrollment: studentCourse.enrollment,
    })),
  );
  const futureLessons = hubLessons
    .filter((lesson) => toMillis(lesson.lesson.date) > now)
    .sort(
      (firstLesson, secondLesson) =>
        toMillis(firstLesson.lesson.date) - toMillis(secondLesson.lesson.date),
    );
  const missedLessons = hubLessons
    .filter(
      (lesson) =>
        toMillis(lesson.lesson.date) <= now && lesson.attendance === null,
    )
    .sort(
      (firstLesson, secondLesson) =>
        toMillis(secondLesson.lesson.date) - toMillis(firstLesson.lesson.date),
    );

  return {
    nextLesson: futureLessons[0] ?? null,
    missedLessons,
  };
}
