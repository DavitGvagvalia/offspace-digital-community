import type { Attendance } from "../../_types/attendance";
import type { Course } from "../../_types/course";
import type { Group } from "../../_types/group";
import type { Lesson } from "../../_types/lesson";
import type { Student } from "../../_types/student";

export type MentorGroupWorkspace = {
  group: Group;
  course: Course | null;
  lessons: Lesson[];
  students: Student[];
  attendances: Attendance[];
};
