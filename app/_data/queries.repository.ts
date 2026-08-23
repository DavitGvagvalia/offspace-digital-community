import { createClient } from "../_lib/supabase/client";
import {
  mapAttendance,
  mapEnrollment,
  mapGroup,
} from "../_lib/supabase/mappers";
import type { Attendance } from "../_types/attendance";
import type { Enrollment } from "../_types/enrollment";
import type { Group } from "../_types/group";
import { throwIfSupabaseError } from "./supabase-errors";

async function getAttendancesByStudent(studentId: string): Promise<Attendance[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendances")
    .select("*")
    .eq("student_id", studentId)
    .is("deleted_at", null);

  throwIfSupabaseError(error);

  return (data ?? []).map(mapAttendance);
}

async function getAttendancesByStudentGroup(
  studentId: string,
  courseId: string,
  groupId: string,
): Promise<Attendance[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendances")
    .select("*")
    .eq("student_id", studentId)
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .is("deleted_at", null);

  throwIfSupabaseError(error);

  return (data ?? []).map(mapAttendance);
}

async function getEnrollmentsByStudent(
  studentId: string,
): Promise<Enrollment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", studentId)
    .is("deleted_at", null);

  throwIfSupabaseError(error);

  return (data ?? []).map(mapEnrollment);
}

async function getEnrollmentsByAssignedGroup(
  courseId: string,
  groupId: string,
  mentorId: string,
): Promise<Enrollment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .eq("mentor_id", mentorId)
    .is("deleted_at", null);

  throwIfSupabaseError(error);

  return (data ?? []).map(mapEnrollment);
}

async function getAttendancesByGroup(
  courseId: string,
  groupId: string,
): Promise<Attendance[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendances")
    .select("*")
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .is("deleted_at", null);

  throwIfSupabaseError(error);

  return (data ?? []).map(mapAttendance);
}

async function getGroupsByMentor(mentorId: string): Promise<Group[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("mentor_id", mentorId)
    .is("deleted_at", null)
    .order("created_at");

  throwIfSupabaseError(error);

  return (data ?? []).map(mapGroup);
}
























export {
  getAttendancesByGroup,
  getAttendancesByStudent,
  getAttendancesByStudentGroup,
  getEnrollmentsByStudent,
  getEnrollmentsByAssignedGroup,
  getGroupsByMentor,
};
