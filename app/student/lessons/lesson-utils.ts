import type { Timestamp } from "firebase/firestore";

import type { AttendedLesson } from "../../services/queries.services";
import type { Course } from "../../types/course.types";

export function getCourseTitle(course: Course) {
  return course.name || course.id;
}

export function sortAttendedLessons(lessons: AttendedLesson[]) {
  return [...lessons].sort((firstLesson, secondLesson) => {
    return (
      firstLesson.lesson.date.toMillis() - secondLesson.lesson.date.toMillis()
    );
  });
}

export function formatLessonDate(date: Timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date.toDate());
}
