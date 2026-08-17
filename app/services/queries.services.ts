import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";
import type { Attendance } from "../types/attendance.types";
import type { Enrollment } from "../types/enrollment.types";
import type { Group } from "../types/group.types";
import type { Lesson } from "../types/lesson.types";
import { getLesson } from "./lessons.services";

const ATTENDANCES_COLLECTION = "Attendances";
const ENROLLMENTS_COLLECTION = "Enrollments";
const GROUPS_COLLECTION = "Groups";

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

async function getEnrollmentsByGroup(groupId: string): Promise<Enrollment[]> {
  const enrollmentsQuery = query(
    collection(db, ENROLLMENTS_COLLECTION),
    where("groupId", "==", groupId),
  );
  const enrollmentsSnapshot = await getDocs(enrollmentsQuery);

  return enrollmentsSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Enrollment[];
}

async function getAttendancesByGroup(groupId: string): Promise<Attendance[]> {
  const attendancesQuery = query(
    collection(db, ATTENDANCES_COLLECTION),
    where("groupId", "==", groupId),
  );
  const attendancesSnapshot = await getDocs(attendancesQuery);

  return attendancesSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Attendance[];
}

async function getGroupsByMentor(mentorId: string): Promise<Group[]> {
  const groupsQuery = query(
    collectionGroup(db, GROUPS_COLLECTION),
    where("mentorId", "==", mentorId),
  );
  const groupsSnapshot = await getDocs(groupsQuery);

  return groupsSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Group[];
}
























export {
  getAttendancesByGroup,
  getAttendedLessonDatesByStudent,
  getAttendedLessonsByStudent,
  getEnrollmentsByStudent,
  getEnrollmentsByGroup,
  getGroupsByMentor,
  type AttendedLesson,
};
