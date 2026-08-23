import type { TimestampString } from "./date";


export interface Student {
  id: string;

  name: string;
  lastName: string;

  email?: string;
  phone?: string;

  createdAt: TimestampString;
  updatedAt?: TimestampString;
}

export type CreateStudent = Omit<
  Student,
  "id" | "createdAt" | "updatedAt"
>;
