import { getActiveCourses, getCourse } from "../../_data/courses.repository";
import { updateEnrollment } from "../../_data/enrollments.repository";
import {
  addGroup,
  updateGroup,
} from "../../_data/groups.repository";
import {
  getEnrollmentsByAssignedGroup,
  getGroupsByMentor,
} from "../../_data/queries.repository";
import { getStudent } from "../../_data/students.repository";
import { createClient } from "../../_lib/supabase/client";
import { mapEnrollment } from "../../_lib/supabase/mappers";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
import type { Group } from "../../_types/group";
import { throwIfSupabaseError } from "../../_data/supabase-errors";
import type {
  MentorCourseRoster,
  MentorEnrollmentStudent,
  MentorGroupManagementState,
} from "../_types/workspace";
import { getMentorGroupWorkspaces } from "./workspace";

export async function getMentorCourses(mentorId: string): Promise<Course[]> {
  const [activeCourses, groups] = await Promise.all([
    getActiveCourses(),
    getGroupsByMentor(mentorId),
  ]);
  const assignedCourseIds = new Set(groups.map((group) => group.courseId));
  const coursesById = new Map<string, Course>();

  activeCourses.forEach((course) => {
    if (course.mentorIds.includes(mentorId) || assignedCourseIds.has(course.id)) {
      coursesById.set(course.id, course);
    }
  });

  await Promise.all(
    groups.map(async (group) => {
      if (coursesById.has(group.courseId)) {
        return;
      }

      const course = await getCourse(group.courseId);

      if (course?.active) {
        coursesById.set(course.id, course);
      }
    }),
  );

  return [...coursesById.values()].sort(compareCourses);
}

export async function getUngroupedMentorEnrollmentStudents(
  mentorId: string,
): Promise<MentorEnrollmentStudent[]> {
  const courses = await getMentorCourses(mentorId);
  const courseIds = courses.map((course) => course.id);

  if (courseIds.length === 0) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .in("course_id", courseIds)
    .eq("status", "active")
    .is("group_id", null)
    .is("mentor_id", null)
    .is("deleted_at", null)
    .order("enrolled_at");

  throwIfSupabaseError(error);

  return getEnrollmentStudents((data ?? []).map(mapEnrollment));
}

export async function getMentorCourseRosters(
  mentorId: string,
): Promise<MentorCourseRoster[]> {
  const [courses, groups, ungroupedStudents] = await Promise.all([
    getMentorCourses(mentorId),
    getGroupsByMentor(mentorId),
    getUngroupedMentorEnrollmentStudents(mentorId),
  ]);

  return courses.map((course) => ({
    course,
    groups: groups
      .filter((group) => group.courseId === course.id)
      .sort(compareGroups),
    ungroupedStudents: ungroupedStudents.filter(
      (item) => item.enrollment.courseId === course.id,
    ),
  }));
}

export async function getMentorGroupManagementState(
  mentorId: string,
): Promise<MentorGroupManagementState> {
  const [courses, workspaces, ungroupedStudents] = await Promise.all([
    getMentorCourses(mentorId),
    getMentorGroupWorkspaces(mentorId),
    getUngroupedMentorEnrollmentStudents(mentorId),
  ]);

  return {
    courses,
    workspaces,
    ungroupedStudents,
  };
}

export async function createMentorGroup({
  mentorId,
  courseId,
  name,
  active,
}: {
  mentorId: string;
  courseId: string;
  name: string;
  active: boolean;
}): Promise<Group> {
  await requireMentorCourse(mentorId, courseId);

  return addGroup({
    courseId,
    mentorId,
    name: name.trim() || undefined,
    active,
  });
}

export async function updateMentorGroup({
  mentorId,
  courseId,
  groupId,
  name,
  active,
}: {
  mentorId: string;
  courseId: string;
  groupId: string;
  name: string;
  active: boolean;
}): Promise<Group> {
  const group = await requireMentorGroup(mentorId, groupId);

  if (group.courseId !== courseId) {
    throw new Error("This group does not belong to that course.");
  }

  return updateGroup(courseId, groupId, {
    name: name.trim() || undefined,
    active,
  });
}

export async function assignEnrollmentToMentorGroup({
  mentorId,
  enrollmentId,
  groupId,
}: {
  mentorId: string;
  enrollmentId: string;
  groupId: string;
}): Promise<Enrollment> {
  const group = await requireMentorGroup(mentorId, groupId);
  const enrollment = await getMentorAssignableEnrollment(mentorId, enrollmentId);

  if (enrollment.courseId !== group.courseId) {
    throw new Error("Student enrollment and group must belong to the same course.");
  }

  return updateEnrollment(enrollment.id, {
    groupId: group.id,
    mentorId,
  });
}

export async function unassignEnrollmentFromMentorGroup({
  mentorId,
  enrollmentId,
}: {
  mentorId: string;
  enrollmentId: string;
}): Promise<Enrollment> {
  const groups = await getGroupsByMentor(mentorId);
  const groupIds = new Set(groups.map((group) => group.id));
  const enrollmentsByGroup = await Promise.all(
    groups.map((group) =>
      getEnrollmentsByAssignedGroup(group.courseId, group.id, mentorId),
    ),
  );
  const enrollment = enrollmentsByGroup
    .flat()
    .find((item) => item.id === enrollmentId);

  if (!enrollment?.groupId || !groupIds.has(enrollment.groupId)) {
    throw new Error("This student is not assigned to one of your groups.");
  }

  return updateEnrollment(enrollment.id, {
    groupId: null,
    mentorId: null,
  });
}

async function getMentorAssignableEnrollment(
  mentorId: string,
  enrollmentId: string,
) {
  const assignableEnrollments = await getUngroupedMentorEnrollmentStudents(
    mentorId,
  );
  const enrollment = assignableEnrollments.find(
    (item) => item.enrollment.id === enrollmentId,
  )?.enrollment;

  if (!enrollment) {
    throw new Error("This student enrollment is not available for assignment.");
  }

  return enrollment;
}

async function requireMentorCourse(mentorId: string, courseId: string) {
  const courses = await getMentorCourses(mentorId);
  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    throw new Error("This course is not available for your mentor account.");
  }

  return course;
}

async function requireMentorGroup(mentorId: string, groupId: string) {
  const groups = await getGroupsByMentor(mentorId);
  const group = groups.find((item) => item.id === groupId);

  if (!group) {
    throw new Error("This group is not available for your mentor account.");
  }

  return group;
}

async function getEnrollmentStudents(enrollments: Enrollment[]) {
  const items = await Promise.all(
    enrollments.map(async (enrollment) => {
      const student = await getStudent(enrollment.studentId);

      return student ? { enrollment, student } : null;
    }),
  );

  return items.filter(
    (item): item is MentorEnrollmentStudent => Boolean(item),
  );
}

function compareCourses(first: Course, second: Course) {
  return first.name.localeCompare(second.name);
}

function compareGroups(first: Group, second: Group) {
  return (first.name ?? first.id).localeCompare(second.name ?? second.id);
}
