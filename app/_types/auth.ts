import type { User } from "@supabase/supabase-js";

import type { Mentor } from "./mentor";
import type { Student } from "./student";
import type { SuperAdmin } from "./super-admin";

export type PortalRole = "student" | "mentor" | "super-admin";

export type PortalCopy = {
  label: string;
  title: string;
  text: string;
  emailLabel: string;
  destination: string;
};

export type PortalProfileByRole<T extends PortalRole> = T extends "student"
  ? Student
  : T extends "mentor"
    ? Mentor
    : SuperAdmin;

export type RequiredProfileState<T extends PortalRole> = {
  user: User | null;
  profile: PortalProfileByRole<T> | null;
  isLoading: boolean;
  error: string | null;
};
