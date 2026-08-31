import type { TimestampString } from "./date";

export interface Mentor {
  id: string;

  name: string;
  last_name: string;

  email?: string;
  phone?: string;

  active: boolean;

  createdAt: TimestampString;
  updatedAt?: TimestampString;
}

export type CreateMentor = Omit<
  Mentor,
  "id" | "createdAt" | "updatedAt"
>;
