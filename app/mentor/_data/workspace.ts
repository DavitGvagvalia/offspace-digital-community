import { getCourse, getCourses } from "../../_data/courses.repository";
import { getLessons } from "../../_data/lessons.repository";
import {
  getAttendancesByGroup,
  getEnrollmentsByAssignedGroup,
  getGroupsByMentor,
  getUnassignedActiveEnrollmentsByCourses,
} from "../../_data/queries.repository";
import { getStudent } from "../../_data/students.repository";
import { toMillis } from "../../_lib/dates";
import type { Course } from "../../_types/course";
import type { Lesson } from "../../_types/lesson";
import type { Student } from "../../_types/student";
import type {
  MentorDashboardWorkspace,
  MentorGroupWorkspace,
  MentorPendingEnrollment,
} from "../_types/workspace";

export async function getMentorDashboardWorkspace(
  mentorId: string,
): Promise<MentorDashboardWorkspace> {
  const [workspaces, allCourses] = await Promise.all([
    getMentorGroupWorkspaces(mentorId),
    getCourses(),
  ]);
  const eligibleCourses = sortCourses(
    allCourses.filter((course) => course.active && course.mentorIds.includes(mentorId)),
  );
  const pendingEnrollments = await getMentorPendingEnrollments(
    eligibleCourses,
  );

  return {
    workspaces,
    eligibleCourses,
    pendingEnrollments,
  };
}

export async function getMentorGroupWorkspaces(
  mentorId: string,
): Promise<MentorGroupWorkspace[]> {
  const groups = await getGroupsByMentor(mentorId);

  return Promise.all(
    groups.map(async (group) => {
      const [course, lessons, enrollments, attendances] = await Promise.all([
        getCourse(group.courseId),
        getLessons(group.courseId, group.id),
        getEnrollmentsByAssignedGroup(group.courseId, group.id, group.mentorId),
        getAttendancesByGroup(group.courseId, group.id),
      ]);
      const students = await Promise.all(
        enrollments.map((enrollment) => getStudent(enrollment.studentId)),
      );

      return {
        group,
        course,
        lessons: sortLessons(lessons),
        students: students.filter(
          (student): student is Student => Boolean(student),
        ),
        attendances,
      };
    }),
  );
}

async function getMentorPendingEnrollments(
  eligibleCourses: Course[],
): Promise<MentorPendingEnrollment[]> {
  const coursesById = new Map(
    eligibleCourses.map((course) => [course.id, course] as const),
  );
  const enrollments = await getUnassignedActiveEnrollmentsByCourses(
    eligibleCourses.map((course) => course.id),
  );

  const pendingEnrollments = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = coursesById.get(enrollment.courseId);
      const student = await getStudent(enrollment.studentId);

      if (!course || !student) {
        return null;
      }

      return {
        enrollment,
        course,
        student,
      };
    }),
  );

  return pendingEnrollments
    .filter(
      (pendingEnrollment): pendingEnrollment is MentorPendingEnrollment =>
        Boolean(pendingEnrollment),
    )
    .sort(comparePendingEnrollments);
}

function sortLessons(lessons: Lesson[]) {
  return [...lessons].sort((firstLesson, secondLesson) => {
    return toMillis(firstLesson.date) - toMillis(secondLesson.date);
  });
}

function sortCourses(courses: Course[]) {
  return [...courses].sort((firstCourse, secondCourse) =>
    firstCourse.name.localeCompare(secondCourse.name),
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

  return `${firstPendingEnrollment.student.lastName} ${firstPendingEnrollment.student.name}`.localeCompare(
    `${secondPendingEnrollment.student.lastName} ${secondPendingEnrollment.student.name}`,
  );
}
