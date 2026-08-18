import { Timestamp } from "firebase/firestore";

import { mapAttendance } from "../_lib/firebase/firestore-mappers";
import type { Attendance, CreateAttendance } from "../_types/attendance";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "../_lib/firebase/firestore-utils";

const ATTENDANCES_COLLECTION = "Attendances";

const getAttendances = async () =>
  listDocuments<Attendance>(ATTENDANCES_COLLECTION, mapAttendance);

const getAttendance = async (id: string) =>
  getDocument<Attendance>(ATTENDANCES_COLLECTION, id, mapAttendance);

const addAttendance = async (attendance: CreateAttendance) => {
  const attendanceId = `${attendance.studentId}_${attendance.lessonId}`;

  return createDocument<Attendance, CreateAttendance>(
    ATTENDANCES_COLLECTION,
    attendance,
    {
      attendedAt: Timestamp.now(),
    },
    attendanceId,
  );
};

const updateAttendance = async (
  id: string,
  attendance: Partial<CreateAttendance>,
) => updateDocument<Attendance>(ATTENDANCES_COLLECTION, id, attendance);

const deleteAttendance = async (id: string) =>
  deleteDocument(ATTENDANCES_COLLECTION, id);

export {
  addAttendance,
  deleteAttendance,
  getAttendance,
  getAttendances,
  updateAttendance,
};
