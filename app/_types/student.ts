import { Timestamp } from "firebase/firestore";


export interface Student {
  id: string;

  name: string;
  lastName: string;

  email?: string;
  phone?: string;

  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type CreateStudent = Omit<
  Student,
  "id" | "createdAt" | "updatedAt"
>;