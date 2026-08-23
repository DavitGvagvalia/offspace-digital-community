import type { TimestampString } from "./date";

export type EnrollmentStatus =
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface Enrollment {
  id: string;

  studentId: string;
  courseId: string;
  groupId?: string;
  mentorId?: string;

  price?: number;

  status: EnrollmentStatus;

  enrolledAt: TimestampString;

  completedAt?: TimestampString;
  updatedAt?: TimestampString;
}



export type CreateEnrollment = Omit<
  Enrollment,
  "id" | "enrolledAt"
>;
