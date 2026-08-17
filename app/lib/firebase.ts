import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseOptions,
} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const requiredConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
} satisfies Record<string, string | undefined>;

const missingConfig = Object.entries(requiredConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  throw new Error(
    `Missing Firebase public configuration: ${missingConfig.join(", ")}`,
  );
}

const firebaseConfig: FirebaseOptions = {
  apiKey: requiredConfig.apiKey,
  authDomain: requiredConfig.authDomain,
  projectId: requiredConfig.projectId,
  storageBucket: requiredConfig.storageBucket,
  messagingSenderId: requiredConfig.messagingSenderId,
  appId: requiredConfig.appId,
};

export const firebase =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
