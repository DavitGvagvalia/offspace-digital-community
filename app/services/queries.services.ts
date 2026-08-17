import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../../firebase";
import type { Attendance } from "../types/attendance.types";
import type { Enrollment } from "../types/enrollment.types";
import type { Lesson } from "../types/lesson.types";
import { getLesson } from "./lessons.services";

const ATTENDANCES_COLLECTION = "Attendances";
const ENROLLMENTS_COLLECTION = "Enrollments";

type AttendedLesson = {
  attendance: Attendance;
  lesson: Lesson;
};

async function getAttendedLessonsByStudent(
  studentId: string,
): Promise<AttendedLesson[]> {
  const attendanceQuery = query(
    collection(db, ATTENDANCES_COLLECTION),
    where("studentId", "==", studentId),
  );
  const attendanceSnapshot = await getDocs(attendanceQuery);
  const attendanceRecords = attendanceSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Attendance[];

  const attendedLessons = await Promise.all(
    attendanceRecords.map(async (attendance) => {
      const lesson = await getLesson(
        attendance.courseId,
        attendance.groupId,
        attendance.lessonId,
      );

      if (!lesson) {
        return null;
      }

      return {
        attendance,
        lesson,
      };
    }),
  );

  return attendedLessons
    .filter((attendedLesson): attendedLesson is AttendedLesson =>
      Boolean(attendedLesson),
    )
    .sort(
      (firstLesson, secondLesson) =>
        firstLesson.lesson.date.toMillis() - secondLesson.lesson.date.toMillis(),
    );
}

async function getAttendedLessonDatesByStudent(studentId: string) {
  const attendedLessons = await getAttendedLessonsByStudent(studentId);

  return attendedLessons.map((attendedLesson) => attendedLesson.lesson.date);
}

async function getEnrollmentsByStudent(
  studentId: string,
): Promise<Enrollment[]> {
  const enrollmentsQuery = query(
    collection(db, ENROLLMENTS_COLLECTION),
    where("studentId", "==", studentId),
  );
  const enrollmentsSnapshot = await getDocs(enrollmentsQuery);

  return enrollmentsSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Enrollment[];
}
























export {
  getAttendedLessonDatesByStudent,
  getAttendedLessonsByStudent,
  getEnrollmentsByStudent,
  type AttendedLesson,
};
