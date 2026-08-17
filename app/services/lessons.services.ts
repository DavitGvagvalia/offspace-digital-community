import { Timestamp } from "firebase/firestore";

import type { CreateLesson, Lesson } from "../types/lesson.types";
import { mapLesson } from "./firestore-mappers";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "./utils";

const LESSONS_COLLECTION = "Lessons";

function getLessonsCollection(courseId: string, groupId: string) {
  return ["Courses", courseId, "Groups", groupId, LESSONS_COLLECTION];
}

const getLessons = async (courseId: string, groupId: string) =>
  listDocuments<Lesson>(getLessonsCollection(courseId, groupId), mapLesson);

const getLesson = async (courseId: string, groupId: string, id: string) =>
  getDocument<Lesson>(getLessonsCollection(courseId, groupId), id, mapLesson);

const addLesson = async (lesson: CreateLesson) =>
  createDocument<Lesson, CreateLesson>(
    getLessonsCollection(lesson.courseId, lesson.groupId),
    lesson,
    {
      createdAt: Timestamp.now(),
    },
  );

const updateLesson = async (
  courseId: string,
  groupId: string,
  id: string,
  lesson: Partial<CreateLesson>,
) =>
  updateDocument<Lesson>(getLessonsCollection(courseId, groupId), id, lesson, {
    updatedAt: Timestamp.now(),
  });

const deleteLesson = async (courseId: string, groupId: string, id: string) =>
  deleteDocument(getLessonsCollection(courseId, groupId), id);

export {
  addLesson,
  deleteLesson,
  getLesson,
  getLessons,
  updateLesson,
};
