import { getCourse } from "../../_data/courses.repository";
import { getGroup } from "../../_data/groups.repository";
import { getLessons } from "../../_data/lessons.repository";
import { toMillis } from "../../_lib/dates";
import {
  getAttendancesByStudentGroup,
  getEnrollmentsByStudent,
  getGroupsByMentor,
} from "../../_data/queries.repository";
import type { Attendance } from "../../_types/attendance";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";
import type { Group } from "../../_types/group";
import type { Lesson } from "../../_types/lesson";

export type StudentCourseDetail = {
  enrollment: Enrollment;
  course: Course | null;
  group: Group | null;
  attendedLessons: Array<{
    attendance: Attendance;
    lesson: Lesson | null;
  }>;
};

export type MentorGroupDetail = {
  group: Group;
  course: Course | null;
};

async function getStudentCourseDetails(
  studentId: string,
): Promise<StudentCourseDetail[]> {
  const enrollments = await getEnrollmentsByStudent(studentId);

  const details = await Promise.all(
    enrollments.map(async (enrollment) => {
      const [course, lessons, attendances] = await Promise.all([
        getCourse(enrollment.courseId),
        enrollment.groupId
          ? getLessons(enrollment.courseId, enrollment.groupId)
          : Promise.resolve([]),
        enrollment.groupId
          ? getAttendancesByStudentGroup(
              studentId,
              enrollment.courseId,
              enrollment.groupId,
            )
          : Promise.resolve([]),
      ]);
      const group = enrollment.groupId
        ? await getGroup(enrollment.courseId, enrollment.groupId)
        : null;
      const lessonsById = new Map(
        lessons.map((lesson) => [lesson.id, lesson] as const),
      );

      return {
        enrollment,
        course,
        group,
        attendedLessons: attendances
          .map((attendance) => ({
            attendance,
            lesson: lessonsById.get(attendance.lessonId) ?? null,
          }))
          .sort(compareAttendedLessons),
      };
    }),
  );

  return details.sort(compareStudentCourseDetails);
}

async function getMentorGroupDetails(
  mentorId: string,
): Promise<MentorGroupDetail[]> {
  const groups = await getGroupsByMentor(mentorId);

  const details = await Promise.all(
    groups.map(async (group) => ({
      group,
      course: await getCourse(group.courseId),
    })),
  );

  return details.sort(compareMentorGroupDetails);
}

function compareStudentCourseDetails(
  first: StudentCourseDetail,
  second: StudentCourseDetail,
) {
  const firstTitle = first.course?.name ?? first.enrollment.courseId;
  const secondTitle = second.course?.name ?? second.enrollment.courseId;

  return firstTitle.localeCompare(secondTitle);
}

function compareMentorGroupDetails(
  first: MentorGroupDetail,
  second: MentorGroupDetail,
) {
  const firstTitle = `${first.course?.name ?? first.group.courseId} ${
    first.group.name ?? first.group.id
  }`;
  const secondTitle = `${second.course?.name ?? second.group.courseId} ${
    second.group.name ?? second.group.id
  }`;

  return firstTitle.localeCompare(secondTitle);
}

function compareAttendedLessons(
  first: StudentCourseDetail["attendedLessons"][number],
  second: StudentCourseDetail["attendedLessons"][number],
) {
  const firstTime =
    first.lesson ? toMillis(first.lesson.date) : toMillis(first.attendance.attendedAt);
  const secondTime =
    second.lesson ? toMillis(second.lesson.date) : toMillis(second.attendance.attendedAt);

  return firstTime - secondTime;
}

export { getMentorGroupDetails, getStudentCourseDetails };
