import { Timestamp } from "firebase/firestore";

import type {
  CreateEnrollment,
  Enrollment,
} from "../types/enrollment.types";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "./utils";

const ENROLLMENTS_COLLECTION = "Enrollments";

const getEnrollments = async () =>
  listDocuments<Enrollment>(ENROLLMENTS_COLLECTION);

const getEnrollment = async (id: string) =>
  getDocument<Enrollment>(ENROLLMENTS_COLLECTION, id);

const addEnrollment = async (enrollment: CreateEnrollment) => {
  const enrollmentId = `${enrollment.studentId}_${enrollment.groupId}`;

  return createDocument<Enrollment, CreateEnrollment>(
    ENROLLMENTS_COLLECTION,
    enrollment,
    {
      enrolledAt: Timestamp.now(),
    },
    enrollmentId,
  );
};

const updateEnrollment = async (
  id: string,
  enrollment: Partial<CreateEnrollment>,
) => updateDocument<Enrollment>(ENROLLMENTS_COLLECTION, id, enrollment);

const deleteEnrollment = async (id: string) =>
  deleteDocument(ENROLLMENTS_COLLECTION, id);

export {
  addEnrollment,
  deleteEnrollment,
  getEnrollment,
  getEnrollments,
  updateEnrollment,
};
