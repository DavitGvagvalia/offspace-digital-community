import type { Course } from "./course.types";
import type { Enrollment } from "./enrollment.types";
import type { Group } from "./group.types";
import type { Mentor } from "./mentor.types";

export type StudentCourseSummary = {
  enrollment: Enrollment;
  course: Course | null;
  group: Group | null;
  mentor: Mentor | null;
};
