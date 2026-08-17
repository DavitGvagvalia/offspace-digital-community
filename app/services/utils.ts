import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../lib/firebase";

type CollectionPath = string | string[];
type DocumentMapper<T> = (id: string, data: DocumentData) => T | null;

function formatFirebaseDate(timestamp: Timestamp): string {
  const date = timestamp.toDate();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getCollectionPath(collectionPath: CollectionPath) {
  if (Array.isArray(collectionPath)) {
    return collectionPath.join("/");
  }

  return collectionPath;
}

function generateUUID(collectionName: CollectionPath) {
  const collectionRef = collection(db, getCollectionPath(collectionName));
  return doc(collectionRef).id;
}

async function listDocuments<T extends { id: string }>(
  collectionName: CollectionPath,
  mapDocument?: DocumentMapper<T>,
): Promise<T[]> {
  const querySnapshot = await getDocs(
    collection(db, getCollectionPath(collectionName)),
  );

  return querySnapshot.docs
    .map((document) => {
      if (mapDocument) {
        return mapDocument(document.id, document.data());
      }

      return {
        id: document.id,
        ...document.data(),
      } as T;
    })
    .filter((document): document is T => Boolean(document));
}

async function getDocument<T extends { id: string }>(
  collectionName: CollectionPath,
  id: string,
  mapDocument?: DocumentMapper<T>,
): Promise<T | null> {
  const documentSnapshot = await getDoc(
    doc(db, getCollectionPath(collectionName), id),
  );

  if (!documentSnapshot.exists()) {
    return null;
  }

  if (mapDocument) {
    return mapDocument(documentSnapshot.id, documentSnapshot.data());
  }

  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as T;
}

async function createDocument<T extends { id: string }, CreateT extends object>(
  collectionName: CollectionPath,
  data: CreateT,
  timestampFields: Record<string, Timestamp> = {},
  id?: string,
): Promise<T> {
  const payload = {
    ...data,
    ...timestampFields,
  };
  const collectionRef = collection(db, getCollectionPath(collectionName));
  const documentRef = id ? doc(collectionRef, id) : await addDoc(
    collectionRef,
    payload as DocumentData,
  );

  if (id) {
    await setDoc(documentRef, payload as DocumentData);
  }

  return {
    id: documentRef.id,
    ...payload,
  } as unknown as T;
}

async function updateDocument<T extends { id: string }>(
  collectionName: CollectionPath,
  id: string,
  data: Partial<Omit<T, "id">>,
  timestampFields: Record<string, Timestamp> = {},
): Promise<T | null> {
  await updateDoc(doc(db, getCollectionPath(collectionName), id), {
    ...data,
    ...timestampFields,
  } as DocumentData);

  return getDocument<T>(collectionName, id);
}

async function deleteDocument(
  collectionName: CollectionPath,
  id: string,
): Promise<void> {
  await deleteDoc(doc(db, getCollectionPath(collectionName), id));
}


const loginWithEmailAndPassword = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};


export {
  createDocument,
  deleteDocument,
  formatFirebaseDate,
  generateUUID,
  getDocument,
  listDocuments,
  updateDocument,
  loginWithEmailAndPassword,
  type DocumentMapper,
};
