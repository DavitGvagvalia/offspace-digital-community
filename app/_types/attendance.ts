import type { TimestampString } from "./date";

export interface Attendance {
  id: string;

  studentId: string;

  courseId: string;
  groupId: string;
  lessonId: string;

  attendedAt: TimestampString;
}
export type CreateAttendance = Omit<
  Attendance,
  "id" | "attendedAt"
>;
