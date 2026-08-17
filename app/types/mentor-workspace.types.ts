import type { Attendance } from "./attendance.types";
import type { Course } from "./course.types";
import type { Group } from "./group.types";
import type { Lesson } from "./lesson.types";
import type { Student } from "./student.types";

export type MentorGroupWorkspace = {
  group: Group;
  course: Course | null;
  lessons: Lesson[];
  students: Student[];
  attendances: Attendance[];
};
