import { Timestamp } from "firebase/firestore";

import {
  getAttendancesByStudentGroup,
  getEnrollmentsByStudent,
} from "../../services/queries.services";
import { getCourse } from "../../services/courses.services";
import { getLessons } from "../../services/lessons.services";
import type { Course } from "../../types/course.types";
import type { StudentCourse } from "./lesson-types";

export async function getStudentLessonCourses(
  studentId: string,
): Promise<StudentCourse[]> {
  const enrollments = await getEnrollmentsByStudent(studentId);

  return Promise.all(
    enrollments.map(async (enrollment) => {
      const [course, scheduledLessons, attendanceRecords] = await Promise.all([
        getStudentCourse(enrollment.courseId),
        getLessons(enrollment.courseId, enrollment.groupId),
        getAttendancesByStudentGroup(
          studentId,
          enrollment.courseId,
          enrollment.groupId,
        ),
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
        lessons: scheduledLessons.map((lesson) => ({
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
    active: true,
    createdAt: Timestamp.fromMillis(0),
  };
}
