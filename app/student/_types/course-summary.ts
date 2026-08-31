import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
import type { Group } from "../../_types/group";

export type StudentCourseMentor = {
  id: string;
  name: string;
  lastName: string;
};

export type StudentCourseSummary = {
  enrollment: Enrollment;
  course: Course | null;
  group: Group | null;
  mentor: StudentCourseMentor | null;
};
