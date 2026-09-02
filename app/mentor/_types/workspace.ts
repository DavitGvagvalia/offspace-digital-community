import type { Attendance } from "../../_types/attendance";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
import type { Group } from "../../_types/group";
import type { Lesson } from "../../_types/lesson";
import type { Student } from "../../_types/student";

export type MentorEnrollmentStudent = {
  enrollment: Enrollment;
  student: Student;
};

export type MentorGroupWorkspace = {
  group: Group;
  course: Course | null;
  lessons: Lesson[];
  enrollmentStudents: MentorEnrollmentStudent[];
  students: Student[];
  attendances: Attendance[];
};

export type MentorCourseRoster = {
  course: Course;
  groups: Group[];
  ungroupedStudents: MentorEnrollmentStudent[];
};

export type MentorGroupManagementState = {
  courses: Course[];
  workspaces: MentorGroupWorkspace[];
  ungroupedStudents: MentorEnrollmentStudent[];
};
