import { addEnrollment } from "../../_data/enrollments.repository";
import { getActiveCourses } from "../../_data/courses.repository";
import { getEnrollmentsByStudent } from "../../_data/queries.repository";
import type { Course } from "../../_types/course";
import type { Enrollment } from "../../_types/enrollment";

export type StudentEnrollmentState = {
  enrollments: Enrollment[];
  availableCourses: Course[];
};

export async function getStudentEnrollmentState(
  studentId: string,
): Promise<StudentEnrollmentState> {
  const enrollments = await getEnrollmentsByStudent(studentId);

  if (enrollments.length > 0) {
    return {
      enrollments,
      availableCourses: [],
    };
  }

  const availableCourses = await getActiveCourses();

  return {
    enrollments,
    availableCourses: sortCourses(availableCourses),
  };
}

export async function enrollStudentInCourses(
  studentId: string,
  courseIds: string[],
): Promise<Enrollment[]> {
  const uniqueCourseIds = [...new Set(courseIds)].filter(Boolean);

  if (uniqueCourseIds.length === 0) {
    return [];
  }

  const activeCourses = await getActiveCourses();
  const activeCourseIds = new Set(activeCourses.map((course) => course.id));
  const validCourseIds = uniqueCourseIds.filter((courseId) =>
    activeCourseIds.has(courseId),
  );

  if (validCourseIds.length !== uniqueCourseIds.length) {
    throw new Error("Only active courses can be selected.");
  }

  return Promise.all(
    validCourseIds.map((courseId) =>
      addEnrollment({
        studentId,
        courseId,
        status: "active",
      }),
    ),
  );
}

function sortCourses(courses: Course[]) {
  return [...courses].sort((firstCourse, secondCourse) =>
    firstCourse.name.localeCompare(secondCourse.name),
  );
}
