import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import type { Attendance } from "../types/attendance.types";
import type { Enrollment } from "../types/enrollment.types";
import type { Group } from "../types/group.types";
import { mapAttendance, mapEnrollment, mapGroup } from "./firestore-mappers";

const ATTENDANCES_COLLECTION = "Attendances";
const ENROLLMENTS_COLLECTION = "Enrollments";
const GROUPS_COLLECTION = "Groups";

async function getAttendancesByStudent(studentId: string): Promise<Attendance[]> {
  const attendanceQuery = query(
    collection(db, ATTENDANCES_COLLECTION),
    where("studentId", "==", studentId),
  );
  const attendanceSnapshot = await getDocs(attendanceQuery);

  return attendanceSnapshot.docs
    .map((document) => mapAttendance(document.id, document.data()))
    .filter((attendance): attendance is Attendance => Boolean(attendance));
}

async function getAttendancesByStudentGroup(
  studentId: string,
  courseId: string,
  groupId: string,
): Promise<Attendance[]> {
  const attendanceQuery = query(
    collection(db, ATTENDANCES_COLLECTION),
    where("studentId", "==", studentId),
    where("courseId", "==", courseId),
    where("groupId", "==", groupId),
  );
  const attendanceSnapshot = await getDocs(attendanceQuery);

  return attendanceSnapshot.docs
    .map((document) => mapAttendance(document.id, document.data()))
    .filter((attendance): attendance is Attendance => Boolean(attendance));
}

async function getEnrollmentsByStudent(
  studentId: string,
): Promise<Enrollment[]> {
  const enrollmentsQuery = query(
    collection(db, ENROLLMENTS_COLLECTION),
    where("studentId", "==", studentId),
  );
  const enrollmentsSnapshot = await getDocs(enrollmentsQuery);

  return enrollmentsSnapshot.docs
    .map((document) => mapEnrollment(document.id, document.data()))
    .filter((enrollment): enrollment is Enrollment => Boolean(enrollment));
}

async function getEnrollmentsByAssignedGroup(
  courseId: string,
  groupId: string,
  mentorId: string,
): Promise<Enrollment[]> {
  const enrollmentsQuery = query(
    collection(db, ENROLLMENTS_COLLECTION),
    where("courseId", "==", courseId),
    where("groupId", "==", groupId),
    where("mentorId", "==", mentorId),
  );
  const enrollmentsSnapshot = await getDocs(enrollmentsQuery);

  return enrollmentsSnapshot.docs
    .map((document) => mapEnrollment(document.id, document.data()))
    .filter((enrollment): enrollment is Enrollment => Boolean(enrollment));
}

async function getAttendancesByGroup(
  courseId: string,
  groupId: string,
): Promise<Attendance[]> {
  const attendancesQuery = query(
    collection(db, ATTENDANCES_COLLECTION),
    where("courseId", "==", courseId),
    where("groupId", "==", groupId),
  );
  const attendancesSnapshot = await getDocs(attendancesQuery);

  return attendancesSnapshot.docs
    .map((document) => mapAttendance(document.id, document.data()))
    .filter((attendance): attendance is Attendance => Boolean(attendance));
}

async function getGroupsByMentor(mentorId: string): Promise<Group[]> {
  const groupsQuery = query(
    collectionGroup(db, GROUPS_COLLECTION),
    where("mentorId", "==", mentorId),
  );
  const groupsSnapshot = await getDocs(groupsQuery);

  return groupsSnapshot.docs
    .map((document) => mapGroup(document.id, document.data()))
    .filter((group): group is Group => Boolean(group));
}
























export {
  getAttendancesByGroup,
  getAttendancesByStudent,
  getAttendancesByStudentGroup,
  getEnrollmentsByStudent,
  getEnrollmentsByAssignedGroup,
  getGroupsByMentor,
};
