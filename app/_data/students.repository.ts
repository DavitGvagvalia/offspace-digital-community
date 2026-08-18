import { Timestamp } from "firebase/firestore";

import { mapStudent } from "../_lib/firebase/firestore-mappers";
import type { CreateStudent, Student } from "../_types/student";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "../_lib/firebase/firestore-utils";

const STUDENTS_COLLECTION = "Students";

const getStudents = async () => listDocuments<Student>(STUDENTS_COLLECTION, mapStudent);

const getStudent = async (id: string) =>
  getDocument<Student>(STUDENTS_COLLECTION, id, mapStudent);

const addStudent = async (student: CreateStudent) =>
  createDocument<Student, CreateStudent>(STUDENTS_COLLECTION, student, {
    createdAt: Timestamp.now(),
  });

const addStudentWithId = async (id: string, student: CreateStudent) =>
  createDocument<Student, CreateStudent>(
    STUDENTS_COLLECTION,
    student,
    {
      createdAt: Timestamp.now(),
    },
    id,
  );

const updateStudent = async (id: string, student: Partial<CreateStudent>) =>
  updateDocument<Student>(STUDENTS_COLLECTION, id, student, {
    updatedAt: Timestamp.now(),
  });

const deleteStudent = async (id: string) =>
  deleteDocument(STUDENTS_COLLECTION, id);


export {
  addStudent,
  addStudentWithId,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
};
