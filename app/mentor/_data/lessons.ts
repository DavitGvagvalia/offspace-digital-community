import {
  addLesson as addLessonRecord,
  updateLesson as updateLessonRecord,
} from "../../_data/lessons.repository";
import type { Lesson } from "../../_types/lesson";

export async function createLessonWithDetails({
  courseId,
  groupId,
  title,
  description,
  date,
}: {
  courseId: string;
  groupId: string;
  title: string;
  description: string;
  date: string;
}): Promise<Lesson> {
  return addLessonRecord({
    courseId,
    groupId,
    title: title.trim(),
    description: description.trim(),
    date,
  });
}

export async function updateLessonDetails({
  courseId,
  groupId,
  lessonId,
  title,
  description,
}: {
  courseId: string;
  groupId: string;
  lessonId: string;
  title: string;
  description: string;
}): Promise<Lesson> {
  return updateLessonRecord(courseId, groupId, lessonId, {
    title: title.trim(),
    description: description.trim(),
  });
}
