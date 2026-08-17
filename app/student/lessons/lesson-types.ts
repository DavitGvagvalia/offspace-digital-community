import type { Attendance } from "../../types/attendance.types";
import type { Course } from "../../types/course.types";
import type { Enrollment } from "../../types/enrollment.types";
import type { Lesson } from "../../types/lesson.types";

export type StudentLesson = {
  lesson: Lesson;
  attendance: Attendance | null;
};

export type StudentCourse = {
  id: string;
  course: Course;
  enrollment: Enrollment;
  groupId: string;
  lessons: StudentLesson[];
};
