import type { TimestampString } from "./date";

export interface Group {
  id: string;

  courseId: string;

  name?: string;

  mentorId: string;

  active: boolean;

  createdAt: TimestampString;
  updatedAt?: TimestampString;
}

export type CreateGroup = Omit<
  Group,
  "id" | "createdAt" | "updatedAt"
>;
