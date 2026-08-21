import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "../_lib/firebase/client";
import { mapCourse } from "../_lib/firebase/firestore-mappers";
import type { Course, CreateCourse } from "../_types/course";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "../_lib/firebase/firestore-utils";

const COURSES_COLLECTION = "Courses";

const getCourses = async () => listDocuments<Course>(COURSES_COLLECTION, mapCourse);

const getActiveCourses = async () => {
  const coursesQuery = query(
    collection(db, COURSES_COLLECTION),
    where("active", "==", true),
  );
  const coursesSnapshot = await getDocs(coursesQuery);

  return coursesSnapshot.docs
    .map((document) => mapCourse(document.id, document.data()))
    .filter((course): course is Course => Boolean(course));
};

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
  getActiveCourses,
  getCourse,
  getCourses,
  getPrivateStudent,
  getPrivateStudents,
  updateCourse,
};
