import { Timestamp } from "firebase/firestore";

export interface Lesson {
  id: string;

  courseId: string;
  groupId: string;

  title?: string;
  description?: string;

  date: Timestamp;

  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
export type CreateLesson = Omit<
  Lesson,
  "id" | "createdAt" | "updatedAt"
>;