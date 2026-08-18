import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "./client";

export async function loginWithEmailAndPassword(
  email: string,
  password: string,
) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signOutCurrentUser() {
  await signOut(auth);
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
