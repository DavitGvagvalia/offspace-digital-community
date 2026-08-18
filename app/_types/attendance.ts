import { Timestamp } from "firebase/firestore";

export interface Attendance {
  id: string;

  studentId: string;

  courseId: string;
  groupId: string;
  lessonId: string;

  attendedAt: Timestamp;
}
export type CreateAttendance = Omit<
  Attendance,
  "id" | "attendedAt"
>;