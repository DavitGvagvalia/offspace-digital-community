import type { AttendedLesson } from "../../services/queries.services";
import type { Course } from "../../types/course.types";
import type { Enrollment } from "../../types/enrollment.types";

export type StudentCourse = {
  id: string;
  course: Course;
  enrollment: Enrollment;
  groupId: string;
  lessons: AttendedLesson[];
};
