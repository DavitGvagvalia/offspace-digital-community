import { Timestamp } from "firebase/firestore";

import { mapMentor } from "../_lib/firebase/firestore-mappers";
import type { CreateMentor, Mentor } from "../_types/mentor";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "../_lib/firebase/firestore-utils";

const MENTORS_COLLECTION = "Mentors";

const getMentors = async () => listDocuments<Mentor>(MENTORS_COLLECTION, mapMentor);

const getMentor = async (id: string) =>
  getDocument<Mentor>(MENTORS_COLLECTION, id, mapMentor);

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
