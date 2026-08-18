import type { User } from "firebase/auth";

import type { Mentor } from "./mentor";
import type { Student } from "./student";

export type PortalRole = "student" | "mentor";

export type PortalCopy = {
  label: string;
  title: string;
  text: string;
  emailLabel: string;
  destination: string;
};

export type PortalProfileByRole<T extends PortalRole> = T extends "student"
  ? Student
  : Mentor;

export type RequiredProfileState<T extends PortalRole> = {
  user: User | null;
  profile: PortalProfileByRole<T> | null;
  isLoading: boolean;
  error: string | null;
};
