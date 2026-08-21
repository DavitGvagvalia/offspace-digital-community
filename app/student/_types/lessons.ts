import type { Attendance } from "../../_types/attendance";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
import type { Lesson } from "../../_types/lesson";

export type StudentLesson = {
  lesson: Lesson;
  attendance: Attendance | null;
};

export type StudentCourse = {
  id: string;
  course: Course;
  enrollment: Enrollment;
  groupId?: string;
  lessons: StudentLesson[];
};
