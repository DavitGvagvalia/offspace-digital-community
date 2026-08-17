import { collection, getDoc, getDocs, doc, Timestamp } from "firebase/firestore";

import { db } from "../lib/firebase";
import type { Course, CreateCourse } from "../types/course.types";
import { mapCourse } from "./firestore-mappers";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "./utils";

const COURSES_COLLECTION = "Courses";

const getCourses = async () => listDocuments<Course>(COURSES_COLLECTION, mapCourse);

const getCourse = async (id: string) =>
  getDocument<Course>(COURSES_COLLECTION, id, mapCourse);

const addCourse = async (course: CreateCourse) =>
  createDocument<Course, CreateCourse>(COURSES_COLLECTION, course, {
    createdAt: Timestamp.now(),
  });

const updateCourse = async (id: string, course: Partial<CreateCourse>) =>
  updateDocument<Course>(COURSES_COLLECTION, id, course, {
    updatedAt: Timestamp.now(),
  });

const deleteCourse = async (id: string) =>
  deleteDocument(COURSES_COLLECTION, id);

const getPrivateStudents = async (courseId: string) => {
  const privateStudents = collection(db, "Courses", courseId, "PrivateStudents");
  const querySnapshot = await getDocs(privateStudents);

  return querySnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

const getPrivateStudent = async (courseId: string, studentId: string) => {
  const docRef = doc(db, "Courses", courseId, "PrivateStudents", studentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
};

export {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  getPrivateStudent,
  getPrivateStudents,
  updateCourse,
};
