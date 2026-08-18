import {
  addAttendance as addAttendanceRecord,
  deleteAttendance as deleteAttendanceRecord,
} from "../../_data/attendance.repository";
import type {
  Attendance,
  CreateAttendance,
} from "../../_types/attendance";

export async function addAttendance(
  attendance: CreateAttendance,
): Promise<Attendance> {
  return addAttendanceRecord(attendance);
}

export async function deleteAttendance(id: string): Promise<void> {
  await deleteAttendanceRecord(id);
}
