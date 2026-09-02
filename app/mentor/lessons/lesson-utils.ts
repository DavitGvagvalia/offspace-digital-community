import {
  formatDateTime,
  formatShortDate,
  formatShortDateTime,
  toMillis,
} from "../../_lib/dates";
import type { Lesson } from "../../_types/lesson";
import type { Student } from "../../_types/student";
import type { MentorGroupWorkspace } from "../_types/workspace";

export function sortLessonsByDate(lessons: MentorGroupWorkspace["lessons"]) {
  return [...lessons].sort((firstLesson, secondLesson) => {
    return toMillis(firstLesson.date) - toMillis(secondLesson.date);
  });
}

export function getStudentName(student: Student) {
  return `${student.name} ${student.lastName}`;
}

export function formatCurrentLocalDateTimeInput() {
  const now = new Date();

  now.setSeconds(0, 0);

  return formatLocalDateTimeInput(now);
}

export function parseLocalDateTimeInput(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatLessonDate(date: Lesson["date"]) {
  return formatDateTime(date);
}

export function formatLessonTimelineDate(date: Lesson["date"]) {
  return formatShortDateTime(date);
}

export function formatShortLessonDate(date: Lesson["date"]) {
  return formatShortDate(date);
}

function formatLocalDateTimeInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
