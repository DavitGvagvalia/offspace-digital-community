import { formatDateTime, formatShortDateTime, toMillis } from "../../_lib/dates";
import type { Course } from "../../_types/course";
import type { TimestampString } from "../../_types/date";
import type { StudentLesson } from "../_types/lessons";

export function getCourseTitle(course: Course) {
  return course.name || course.id;
}

export function sortStudentLessons(lessons: StudentLesson[]) {
  return [...lessons].sort((firstLesson, secondLesson) => {
    return (
      toMillis(firstLesson.lesson.date) - toMillis(secondLesson.lesson.date)
    );
  });
}

export function formatLessonDate(date: TimestampString) {
  return formatDateTime(date);
}

export function formatLessonTimelineDate(date: TimestampString) {
  return formatShortDateTime(date);
}
