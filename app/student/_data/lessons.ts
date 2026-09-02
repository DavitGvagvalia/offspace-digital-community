import { toMillis } from "../../_lib/dates";
import {
  getAttendancesByStudentGroup,
  getEnrollmentsByStudent,
} from "../../_data/queries.repository";
import { getCourse } from "../../_data/courses.repository";
import { getLessons } from "../../_data/lessons.repository";
import type { Course } from "../../_types/course";
import type { StudentCourse } from "../_types/lessons";

export async function getStudentLessonCourses(
  studentId: string,
  options: { includeFutureLessons?: boolean } = {},
): Promise<StudentCourse[]> {
  const enrollments = await getEnrollmentsByStudent(studentId);
  const now = Date.now();

  return Promise.all(
    enrollments.map(async (enrollment) => {
      const [course, scheduledLessons, attendanceRecords] = await Promise.all([
        getStudentCourse(enrollment.courseId),
        enrollment.groupId
          ? getLessons(enrollment.courseId, enrollment.groupId)
          : Promise.resolve([]),
        enrollment.groupId
          ? getAttendancesByStudentGroup(
              studentId,
              enrollment.courseId,
              enrollment.groupId,
            )
          : Promise.resolve([]),
      ]);
      const attendanceByLessonId = new Map(
        attendanceRecords
          .filter((attendance) => attendance.courseId === enrollment.courseId)
          .map((attendance) => [attendance.lessonId, attendance]),
      );

      return {
        id: enrollment.id,
        course,
        enrollment,
        groupId: enrollment.groupId,
        lessons: scheduledLessons
          .filter(
            (lesson) =>
              options.includeFutureLessons || toMillis(lesson.date) <= now,
          )
          .map((lesson) => ({
            lesson,
            attendance: attendanceByLessonId.get(lesson.id) ?? null,
          })),
      };
    }),
  );
}

async function getStudentCourse(courseId: string): Promise<Course> {
  const course = await getCourse(courseId);

  if (course) {
    return course;
  }

  return {
    id: courseId,
    name: courseId,
    mentorIds: [],
    active: true,
    createdAt: new Date(0).toISOString(),
  };
}
