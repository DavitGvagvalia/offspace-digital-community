import type { TimestampString } from "./date";

export interface Lesson {
  id: string;

  courseId: string;
  groupId: string;

  title?: string;
  description?: string;

  date: TimestampString;

  createdAt: TimestampString;
  updatedAt?: TimestampString;
}
export type CreateLesson = Omit<
  Lesson,
  "id" | "createdAt" | "updatedAt"
>;
