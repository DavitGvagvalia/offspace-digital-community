import {
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";

import { auth } from "../../_lib/firebase/client";
import { signOutCurrentUser } from "../../_lib/firebase/auth";
import { addStudentWithId, getStudent } from "../../_data/students.repository";
import type { Student } from "../../_types/student";

export async function getStudentProfile(uid: string) {
  return getStudent(uid);
}

export async function registerStudentAccount({
  email,
  password,
  name,
  lastName,
  phone,
}: {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone?: string;
}): Promise<Student> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  try {
    return await addStudentWithId(credential.user.uid, {
      name,
      lastName,
      email,
      ...(phone ? { phone } : {}),
    });
  } catch (profileError) {
    try {
      await deleteUser(credential.user);
    } catch {
      await signOutCurrentUser();
    }

    throw profileError;
  }
}
