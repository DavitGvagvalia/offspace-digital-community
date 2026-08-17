import { onAuthStateChanged, signOut, type User } from "firebase/auth";

import { auth } from "../lib/firebase";
import type {
  PortalProfileByRole,
  PortalRole,
} from "../types/auth.types";
import { getMentor } from "./mentors.services";
import { getStudent } from "./students.services";
import { loginWithEmailAndPassword } from "./utils";

export const loginPath: Record<PortalRole, string> = {
  student: "/student/login",
  mentor: "/mentor/login",
};

export async function loginToPortal(email: string, password: string) {
  return loginWithEmailAndPassword(email, password);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signOutCurrentUser() {
  await signOut(auth);
}

export async function getPortalProfile<T extends PortalRole>(
  role: T,
  uid: string,
): Promise<PortalProfileByRole<T> | null> {
  if (role === "student") {
    return (await getStudent(uid)) as PortalProfileByRole<T> | null;
  }

  return (await getMentor(uid)) as PortalProfileByRole<T> | null;
}

export async function hasPortalAccess(role: PortalRole, uid: string) {
  return Boolean(await getPortalProfile(role, uid));
}

export function getFirebaseLoginMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      return "The email or password is incorrect.";
    }
  }

  return "We could not sign you in right now. Please try again.";
}
