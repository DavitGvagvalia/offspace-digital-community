import type { TimestampString } from "./date";

export interface SuperAdmin {
  id: string;

  name?: string;
  lastName?: string;
  email?: string;

  createdAt?: TimestampString;
}
