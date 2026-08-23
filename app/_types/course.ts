import type { TimestampString } from "./date";

export interface Course {
  id: string;

  name: string;
  description?: string;
  mentorIds: string[];

  active: boolean;

  createdAt: TimestampString;
  updatedAt?: TimestampString;
}

export type CreateCourse = Omit<
  Course,
  "id" | "createdAt" | "updatedAt" | "mentorIds"
> & {
  mentorIds?: string[];
};
