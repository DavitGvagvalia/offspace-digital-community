import { Timestamp } from "firebase/firestore";

import type { CreateMentor, Mentor } from "../types/mentor.types";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "./utils";

const MENTORS_COLLECTION = "Mentors";

const getMentors = async () => listDocuments<Mentor>(MENTORS_COLLECTION);

const getMentor = async (id: string) =>
  getDocument<Mentor>(MENTORS_COLLECTION, id);

const addMentor = async (mentor: CreateMentor) =>
  createDocument<Mentor, CreateMentor>(MENTORS_COLLECTION, mentor, {
    createdAt: Timestamp.now(),
  });

const updateMentor = async (id: string, mentor: Partial<CreateMentor>) =>
  updateDocument<Mentor>(MENTORS_COLLECTION, id, mentor);

const deleteMentor = async (id: string) =>
  deleteDocument(MENTORS_COLLECTION, id);

export {
  addMentor,
  deleteMentor,
  getMentor,
  getMentors,
  updateMentor,
};
