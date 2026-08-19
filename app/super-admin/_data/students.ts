import {
  deleteApp,
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signOut,
} from "firebase/auth";

import { addStudentWithId } from "../../_data/students.repository";
import type { CreateStudent, Student } from "../../_types/student";

export {
  addStudent,
  addStudentWithId,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from "../../_data/students.repository";

const STUDENT_CREATION_APP_NAME = "student-creation";

type StudentAuthInput = {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone?: string;
};

type StudentAuthCreationResult = {
  student: Student;
  uid: string;
  email: string;
};

const requiredConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
} satisfies Record<string, string | undefined>;

function getFirebaseConfig(): FirebaseOptions {
  const missingConfig = Object.entries(requiredConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingConfig.length > 0) {
    throw new Error(
      `Missing Firebase public configuration: ${missingConfig.join(", ")}`,
    );
  }

  return {
    apiKey: requiredConfig.apiKey,
    authDomain: requiredConfig.authDomain,
    projectId: requiredConfig.projectId,
    storageBucket: requiredConfig.storageBucket,
    messagingSenderId: requiredConfig.messagingSenderId,
    appId: requiredConfig.appId,
  };
}

function getStudentCreationApp(): FirebaseApp {
  return getApps().some((app) => app.name === STUDENT_CREATION_APP_NAME)
    ? getApp(STUDENT_CREATION_APP_NAME)
    : initializeApp(getFirebaseConfig(), STUDENT_CREATION_APP_NAME);
}

async function createStudentProfileWithAuthUid(
  uid: string,
  student: CreateStudent,
): Promise<Student> {
  return addStudentWithId(uid, student);
}

async function createStudentAuthAndProfile({
  email,
  password,
  name,
  lastName,
  phone,
}: StudentAuthInput): Promise<StudentAuthCreationResult> {
  const studentCreationApp = getStudentCreationApp();
  const studentCreationAuth = getAuth(studentCreationApp);
  const credential = await createUserWithEmailAndPassword(
    studentCreationAuth,
    email,
    password,
  );
  const uid = credential.user.uid;

  try {
    const student = await createStudentProfileWithAuthUid(uid, {
      name,
      lastName,
      email,
      ...(phone ? { phone } : {}),
    });

    return {
      student,
      uid,
      email,
    };
  } catch (profileError) {
    try {
      await deleteUser(credential.user);
    } catch (deleteError) {
      console.error(deleteError);
    }

    throw profileError;
  } finally {
    try {
      await signOut(studentCreationAuth);
    } catch (signOutError) {
      console.error(signOutError);
    }

    try {
      await deleteApp(studentCreationApp);
    } catch (deleteAppError) {
      console.error(deleteAppError);
    }
  }
}

export {
  createStudentAuthAndProfile,
  createStudentProfileWithAuthUid,
  type StudentAuthCreationResult,
  type StudentAuthInput,
};
