import { Timestamp } from "firebase/firestore";

export interface Group {
  id: string;

  courseId: string;

  name?: string;

  mentorId: string;

  active: boolean;

  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type CreateGroup = Omit<
  Group,
  "id" | "createdAt" | "updatedAt"
>;