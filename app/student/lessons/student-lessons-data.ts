import { Timestamp } from "firebase/firestore";

import {
  getAttendedLessonsByStudent,
  getEnrollmentsByStudent,
} from "../../services/queries.services";
import { getCourse } from "../../services/courses.services";
import type { Course } from "../../types/course.types";
import type { StudentCourse } from "./lesson-types";

export async function getStudentLessonCourses(
  studentId: string,
): Promise<StudentCourse[]> {
  const enrollments = await getEnrollmentsByStudent(studentId);
  const attendedLessons = await getAttendedLessonsByStudent(studentId);

  return Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await getStudentCourse(enrollment.courseId);
      const lessons = attendedLessons.filter((attendedLesson) => {
        return (
          attendedLesson.attendance.courseId === enrollment.courseId &&
          attendedLesson.attendance.groupId === enrollment.groupId
        );
      });

      return {
        id: enrollment.id,
        course,
        enrollment,
        groupId: enrollment.groupId,
        lessons,
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
