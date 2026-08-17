import { Timestamp } from "firebase/firestore";

export interface Course {
  id: string;

  name: string;
  description?: string;

  active: boolean;

  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type CreateCourse = Omit<
  Course,
  "id" | "createdAt" | "updatedAt"
>;