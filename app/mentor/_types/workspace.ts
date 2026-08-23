import type { Attendance } from "../../_types/attendance";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
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

export type MentorPendingEnrollment = {
  enrollment: Enrollment;
  course: Course;
  student: Student;
};

export type MentorDashboardWorkspace = {
  workspaces: MentorGroupWorkspace[];
  eligibleCourses: Course[];
  pendingEnrollments: MentorPendingEnrollment[];
};
