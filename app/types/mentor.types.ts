import { Timestamp } from "firebase/firestore";

export interface Mentor {
  id: string;

  name: string;
  lastName: string;

  email?: string;
  phone?: string;

  active: boolean;

  createdAt: Timestamp;
}

export type CreateMentor = Omit<
  Mentor,
  "id" | "createdAt" | "updatedAt"
>;