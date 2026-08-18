import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
import type { Group } from "../../_types/group";
import type { Mentor } from "../../_types/mentor";

export type StudentCourseSummary = {
  enrollment: Enrollment;
  course: Course | null;
  group: Group | null;
  mentor: Mentor | null;
};
