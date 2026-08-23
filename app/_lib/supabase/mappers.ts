import type { Attendance } from "../../_types/attendance";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
import type { Group } from "../../_types/group";
import type { Lesson } from "../../_types/lesson";
import type { Mentor } from "../../_types/mentor";
import type { Student } from "../../_types/student";
import type { SuperAdmin } from "../../_types/super-admin";
import type { Database } from "../../_types/supabase";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type StudentRow = Database["public"]["Tables"]["students"]["Row"];
type MentorRow = Database["public"]["Tables"]["mentors"]["Row"];
type SuperAdminRow = Database["public"]["Tables"]["super_admins"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type GroupRow = Database["public"]["Tables"]["groups"]["Row"];
type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
type EnrollmentRow = Database["public"]["Tables"]["enrollments"]["Row"];
type AttendanceRow = Database["public"]["Tables"]["attendances"]["Row"];

function mapStudent(profile: ProfileRow): Student {
  return {
    id: profile.id,
    name: profile.name,
    lastName: profile.last_name,
    ...(profile.email ? { email: profile.email } : {}),
    ...(profile.phone ? { phone: profile.phone } : {}),
    createdAt: profile.created_at,
    ...(profile.updated_at ? { updatedAt: profile.updated_at } : {}),
  };
}

function mapMentor(profile: ProfileRow, mentor: Pick<MentorRow, "active">): Mentor {
  return {
    id: profile.id,
    name: profile.name,
    lastName: profile.last_name,
    ...(profile.email ? { email: profile.email } : {}),
    ...(profile.phone ? { phone: profile.phone } : {}),
    active: mentor.active,
    createdAt: profile.created_at,
    ...(profile.updated_at ? { updatedAt: profile.updated_at } : {}),
  };
}

function mapSuperAdmin(profile: ProfileRow, admin?: SuperAdminRow): SuperAdmin {
  return {
    id: profile.id,
    ...(profile.name ? { name: profile.name } : {}),
    ...(profile.last_name ? { lastName: profile.last_name } : {}),
    ...(profile.email ? { email: profile.email } : {}),
    createdAt: admin?.created_at ?? profile.created_at,
  };
}

function mapCourse(row: CourseRow, mentorIds: string[] = []): Course {
  return {
    id: row.id,
    name: row.name,
    ...(row.description ? { description: row.description } : {}),
    mentorIds,
    active: row.active,
    createdAt: row.created_at,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

function mapGroup(row: GroupRow): Group {
  return {
    id: row.id,
    courseId: row.course_id,
    ...(row.name ? { name: row.name } : {}),
    mentorId: row.mentor_id,
    active: row.active,
    createdAt: row.created_at,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

function mapLesson(row: LessonRow): Lesson {
  return {
    id: row.id,
    courseId: row.course_id,
    groupId: row.group_id,
    ...(row.title ? { title: row.title } : {}),
    ...(row.description ? { description: row.description } : {}),
    date: row.lesson_at,
    createdAt: row.created_at,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

function mapEnrollment(row: EnrollmentRow): Enrollment {
  return {
    id: row.id,
    studentId: row.student_id,
    courseId: row.course_id,
    ...(row.group_id ? { groupId: row.group_id } : {}),
    ...(row.mentor_id ? { mentorId: row.mentor_id } : {}),
    ...(row.price !== null ? { price: row.price } : {}),
    status: row.status,
    enrolledAt: row.enrolled_at,
    ...(row.completed_at ? { completedAt: row.completed_at } : {}),
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

function mapAttendance(row: AttendanceRow): Attendance {
  return {
    id: row.id,
    studentId: row.student_id,
    courseId: row.course_id,
    groupId: row.group_id,
    lessonId: row.lesson_id,
    attendedAt: row.attended_at,
  };
}

export {
  mapAttendance,
  mapCourse,
  mapEnrollment,
  mapGroup,
  mapLesson,
  mapMentor,
  mapStudent,
  mapSuperAdmin,
  type AttendanceRow,
  type CourseRow,
  type EnrollmentRow,
  type GroupRow,
  type LessonRow,
  type MentorRow,
  type ProfileRow,
  type StudentRow,
  type SuperAdminRow,
};
