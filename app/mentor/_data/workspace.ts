<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
"use server";

import { createAdminSupabaseClient } from "../../_lib/supabase/admin";
import { createServerSupabaseClient } from "../../_lib/supabase/server";
<<<<<<< HEAD
import {
  mapAttendance,
  mapCourse,
  mapEnrollment,
  mapGroup,
  mapLesson,
  mapStudent,
} from "../../_lib/supabase/mappers";
import { toMillis } from "../../_lib/dates";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
=======
import { getCourse, getCourses } from "../../_data/courses.repository";
import { getLessons } from "../../_data/lessons.repository";
=======
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
import {
  mapAttendance,
  mapCourse,
  mapEnrollment,
  mapGroup,
  mapLesson,
  mapStudent,
} from "../../_lib/supabase/mappers";
import { toMillis } from "../../_lib/dates";
import type { Course } from "../../_types/course";
<<<<<<< HEAD
>>>>>>> 4c9f986 (feat: implement mentor group creation and enrollment management, add policies for unassigned active enrollments)
=======
import type { Enrollment } from "../../_types/enrollment";
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
import type { Lesson } from "../../_types/lesson";
import type { Student } from "../../_types/student";
import type {
  MentorDashboardWorkspace,
  MentorGroupWorkspace,
  MentorPendingEnrollment,
} from "../_types/workspace";
<<<<<<< HEAD
=======

async function getMentorDashboardWorkspace(
  mentorId: string,
): Promise<MentorDashboardWorkspace> {
  const currentMentorId = await assertCurrentUserIsActiveMentor();

  if (mentorId !== currentMentorId) {
    throw new Error("This mentor workspace is not available for your account.");
  }

  const eligibleCourses = await getEligibleCourses(currentMentorId);
  const [workspaces, pendingEnrollments] = await Promise.all([
    getMentorGroupWorkspaces(currentMentorId),
    getMentorPendingEnrollments(eligibleCourses),
  ]);

  return {
    workspaces,
    eligibleCourses,
    pendingEnrollments,
  };
}
>>>>>>> 4c9f986 (feat: implement mentor group creation and enrollment management, add policies for unassigned active enrollments)

<<<<<<< HEAD
async function getMentorDashboardWorkspace(
  mentorId: string,
): Promise<MentorDashboardWorkspace> {
  const currentMentorId = await assertCurrentUserIsActiveMentor();

  if (mentorId !== currentMentorId) {
    throw new Error("This mentor workspace is not available for your account.");
  }

  const eligibleCourses = await getEligibleCourses(currentMentorId);
  const [workspaces, pendingEnrollments] = await Promise.all([
    getMentorGroupWorkspaces(currentMentorId),
    getMentorPendingEnrollments(eligibleCourses),
  ]);

  return {
    workspaces,
    eligibleCourses,
    pendingEnrollments,
  };
}

=======
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
async function getMentorGroupWorkspaces(
  mentorId: string,
): Promise<MentorGroupWorkspace[]> {
  const admin = createAdminSupabaseClient();
  const { data: groups, error: groupsError } = await admin
    .from("groups")
    .select("*")
    .eq("mentor_id", mentorId)
    .is("deleted_at", null)
    .order("created_at");

  if (groupsError) {
    throw groupsError;
  }

  return Promise.all(
    (groups ?? []).map(async (group) => {
      const [course, lessons, enrollments, attendances] = await Promise.all([
        getCourse(group.course_id),
        getGroupLessons(group.course_id, group.id),
        getAssignedGroupEnrollments(group.course_id, group.id, mentorId),
        getGroupAttendances(group.course_id, group.id),
      ]);
      const students = await getStudentsByIds(
        enrollments.map((enrollment) => enrollment.studentId),
      );

      return {
        group: mapGroup(group),
        course,
        lessons: sortLessons(lessons),
        students,
        attendances,
      };
    }),
  );
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
async function assertCurrentUserIsActiveMentor() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in as a mentor.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .eq("role", "mentor")
    .is("deleted_at", null)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("This account does not have mentor access.");
  }

  const { data: mentor, error: mentorError } = await supabase
    .from("mentors")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (mentorError || !mentor) {
    throw new Error("This mentor account is not active.");
  }

  return user.id;
}

async function getEligibleCourses(mentorId: string): Promise<Course[]> {
  const admin = createAdminSupabaseClient();
  const { data: eligibilityRows, error: eligibilityError } = await admin
    .from("course_mentor_eligibility")
    .select("course_id")
    .eq("mentor_id", mentorId)
    .is("deleted_at", null);

  if (eligibilityError) {
    throw eligibilityError;
  }

  const courseIds = (eligibilityRows ?? []).map((row) => row.course_id);

  if (courseIds.length === 0) {
    return [];
  }

  const { data: courses, error: coursesError } = await admin
    .from("courses")
    .select("*")
    .in("id", courseIds)
    .eq("active", true)
    .is("deleted_at", null)
    .order("name");

  if (coursesError) {
    throw coursesError;
  }

  return (courses ?? []).map((course) => mapCourse(course, [mentorId]));
}

<<<<<<< HEAD
async function getMentorPendingEnrollments(
  eligibleCourses: Course[],
): Promise<MentorPendingEnrollment[]> {
  if (eligibleCourses.length === 0) {
    return [];
  }

  const admin = createAdminSupabaseClient();
  const coursesById = new Map(
    eligibleCourses.map((course) => [course.id, course] as const),
  );
  const { data: enrollments, error: enrollmentsError } = await admin
    .from("enrollments")
    .select("*")
    .in("course_id", eligibleCourses.map((course) => course.id))
    .eq("status", "active")
    .is("group_id", null)
    .is("mentor_id", null)
    .is("deleted_at", null)
    .order("enrolled_at");

  if (enrollmentsError) {
    throw enrollmentsError;
  }

  const mappedEnrollments = (enrollments ?? []).map(mapEnrollment);
  const studentsById = new Map(
    (await getStudentsByIds(
      mappedEnrollments.map((enrollment) => enrollment.studentId),
    )).map((student) => [student.id, student] as const),
  );

  return mappedEnrollments
    .map((enrollment) => {
      const course = coursesById.get(enrollment.courseId);
      const student = studentsById.get(enrollment.studentId);
=======
=======
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
async function getMentorPendingEnrollments(
  eligibleCourses: Course[],
): Promise<MentorPendingEnrollment[]> {
  if (eligibleCourses.length === 0) {
    return [];
  }

  const admin = createAdminSupabaseClient();
  const coursesById = new Map(
    eligibleCourses.map((course) => [course.id, course] as const),
  );
  const { data: enrollments, error: enrollmentsError } = await admin
    .from("enrollments")
    .select("*")
    .in("course_id", eligibleCourses.map((course) => course.id))
    .eq("status", "active")
    .is("group_id", null)
    .is("mentor_id", null)
    .is("deleted_at", null)
    .order("enrolled_at");

  if (enrollmentsError) {
    throw enrollmentsError;
  }

  const mappedEnrollments = (enrollments ?? []).map(mapEnrollment);
  const studentsById = new Map(
    (await getStudentsByIds(
      mappedEnrollments.map((enrollment) => enrollment.studentId),
    )).map((student) => [student.id, student] as const),
  );

  return mappedEnrollments
    .map((enrollment) => {
      const course = coursesById.get(enrollment.courseId);
<<<<<<< HEAD
      const student = await getStudent(enrollment.studentId);
>>>>>>> 4c9f986 (feat: implement mentor group creation and enrollment management, add policies for unassigned active enrollments)
=======
      const student = studentsById.get(enrollment.studentId);
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)

      if (!course || !student) {
        return null;
      }

      return {
        enrollment,
        course,
        student,
      };
<<<<<<< HEAD
<<<<<<< HEAD
    })
=======
    }),
  );

  return pendingEnrollments
>>>>>>> 4c9f986 (feat: implement mentor group creation and enrollment management, add policies for unassigned active enrollments)
=======
    })
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
    .filter(
      (pendingEnrollment): pendingEnrollment is MentorPendingEnrollment =>
        Boolean(pendingEnrollment),
    )
    .sort(comparePendingEnrollments);
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
async function getCourse(courseId: string): Promise<Course | null> {
  const admin = createAdminSupabaseClient();
  const { data: course, error: courseError } = await admin
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .is("deleted_at", null)
    .maybeSingle();

  if (courseError) {
    throw courseError;
  }

  return course ? mapCourse(course) : null;
}

async function getGroupLessons(
  courseId: string,
  groupId: string,
): Promise<Lesson[]> {
  const admin = createAdminSupabaseClient();
  const { data: lessons, error: lessonsError } = await admin
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .is("deleted_at", null);

  if (lessonsError) {
    throw lessonsError;
  }

  return (lessons ?? []).map(mapLesson);
}

async function getAssignedGroupEnrollments(
  courseId: string,
  groupId: string,
  mentorId: string,
): Promise<Enrollment[]> {
  const admin = createAdminSupabaseClient();
  const { data: enrollments, error: enrollmentsError } = await admin
    .from("enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .eq("mentor_id", mentorId)
    .is("deleted_at", null);

  if (enrollmentsError) {
    throw enrollmentsError;
  }

  return (enrollments ?? []).map(mapEnrollment);
}

async function getGroupAttendances(courseId: string, groupId: string) {
  const admin = createAdminSupabaseClient();
  const { data: attendances, error: attendancesError } = await admin
    .from("attendances")
    .select("*")
    .eq("course_id", courseId)
    .eq("group_id", groupId)
    .is("deleted_at", null);

  if (attendancesError) {
    throw attendancesError;
  }

  return (attendances ?? []).map(mapAttendance);
}

async function getStudentsByIds(studentIds: string[]): Promise<Student[]> {
  const uniqueStudentIds = [...new Set(studentIds)].filter(Boolean);

  if (uniqueStudentIds.length === 0) {
    return [];
  }

  const admin = createAdminSupabaseClient();
  const { data: students, error: studentsError } = await admin
    .from("profiles")
    .select("*")
    .in("id", uniqueStudentIds)
    .eq("role", "student")
    .is("deleted_at", null);

  if (studentsError) {
    throw studentsError;
  }

  return (students ?? []).map(mapStudent).sort(compareStudents);
}

<<<<<<< HEAD
=======
>>>>>>> 4c9f986 (feat: implement mentor group creation and enrollment management, add policies for unassigned active enrollments)
=======
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
function sortLessons(lessons: Lesson[]) {
  return [...lessons].sort((firstLesson, secondLesson) => {
    return toMillis(firstLesson.date) - toMillis(secondLesson.date);
  });
}

<<<<<<< HEAD
<<<<<<< HEAD
function compareStudents(firstStudent: Student, secondStudent: Student) {
  return `${firstStudent.lastName} ${firstStudent.name}`.localeCompare(
    `${secondStudent.lastName} ${secondStudent.name}`,
=======
function sortCourses(courses: Course[]) {
  return [...courses].sort((firstCourse, secondCourse) =>
    firstCourse.name.localeCompare(secondCourse.name),
>>>>>>> 4c9f986 (feat: implement mentor group creation and enrollment management, add policies for unassigned active enrollments)
=======
function compareStudents(firstStudent: Student, secondStudent: Student) {
  return `${firstStudent.lastName} ${firstStudent.name}`.localeCompare(
    `${secondStudent.lastName} ${secondStudent.name}`,
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
  );
}

function comparePendingEnrollments(
  firstPendingEnrollment: MentorPendingEnrollment,
  secondPendingEnrollment: MentorPendingEnrollment,
) {
  const courseComparison = firstPendingEnrollment.course.name.localeCompare(
    secondPendingEnrollment.course.name,
  );

  if (courseComparison !== 0) {
    return courseComparison;
  }

<<<<<<< HEAD
<<<<<<< HEAD
  return compareStudents(
    firstPendingEnrollment.student,
    secondPendingEnrollment.student,
  );
}

export { getMentorDashboardWorkspace, getMentorGroupWorkspaces };
=======
  return `${firstPendingEnrollment.student.lastName} ${firstPendingEnrollment.student.name}`.localeCompare(
    `${secondPendingEnrollment.student.lastName} ${secondPendingEnrollment.student.name}`,
  );
}
>>>>>>> 4c9f986 (feat: implement mentor group creation and enrollment management, add policies for unassigned active enrollments)
=======
  return compareStudents(
    firstPendingEnrollment.student,
    secondPendingEnrollment.student,
  );
}

export { getMentorDashboardWorkspace, getMentorGroupWorkspaces };
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
