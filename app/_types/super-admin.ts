import { Timestamp } from "firebase/firestore";

export interface SuperAdmin {
  id: string;

  name?: string;
  lastName?: string;
  email?: string;

  createdAt?: Timestamp;
}
