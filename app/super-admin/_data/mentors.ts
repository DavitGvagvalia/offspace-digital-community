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
import { Timestamp } from "firebase/firestore";

import { createDocument } from "../../_lib/firebase/firestore-utils";
import type { CreateMentor, Mentor } from "../../_types/mentor";

const MENTORS_COLLECTION = "Mentors";
const MENTOR_CREATION_APP_NAME = "mentor-creation";

type MentorAuthInput = {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone?: string;
  active?: boolean;
};

type MentorAuthCreationResult = {
  mentor: Mentor;
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

function getMentorCreationApp(): FirebaseApp {
  return getApps().some((app) => app.name === MENTOR_CREATION_APP_NAME)
    ? getApp(MENTOR_CREATION_APP_NAME)
    : initializeApp(getFirebaseConfig(), MENTOR_CREATION_APP_NAME);
}

async function createMentorProfileWithAuthUid(
  uid: string,
  mentor: CreateMentor,
): Promise<Mentor> {
  // This write requires a trusted super-admin path; current Firestore rules block public Mentors writes.
  return createDocument<Mentor, CreateMentor>(
    MENTORS_COLLECTION,
    mentor,
    {
      createdAt: Timestamp.now(),
    },
    uid,
  );
}

async function createMentorAuthAndProfile({
  email,
  password,
  name,
  lastName,
  phone,
  active = true,
}: MentorAuthInput): Promise<MentorAuthCreationResult> {
  const mentorCreationApp = getMentorCreationApp();
  const mentorCreationAuth = getAuth(mentorCreationApp);
  const credential = await createUserWithEmailAndPassword(
    mentorCreationAuth,
    email,
    password,
  );
  const uid = credential.user.uid;

  try {
    const mentor = await createMentorProfileWithAuthUid(uid, {
      name,
      lastName,
      email,
      active,
      ...(phone ? { phone } : {}),
    });

    return {
      mentor,
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
      await signOut(mentorCreationAuth);
    } catch (signOutError) {
      console.error(signOutError);
    }

    try {
      await deleteApp(mentorCreationApp);
    } catch (deleteAppError) {
      console.error(deleteAppError);
    }
  }
}

export {
  createMentorAuthAndProfile,
  createMentorProfileWithAuthUid,
  type MentorAuthCreationResult,
  type MentorAuthInput,
};
