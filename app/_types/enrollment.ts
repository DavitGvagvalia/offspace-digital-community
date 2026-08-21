import { Timestamp } from "firebase/firestore";

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

  enrolledAt: Timestamp;

  completedAt?: Timestamp;
}



export type CreateEnrollment = Omit<
  Enrollment,
  "id" | "enrolledAt"
>;
