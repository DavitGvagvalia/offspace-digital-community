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

function sortCourses(courses: Course[]) {
  return [...courses].sort((firstCourse, secondCourse) =>
    firstCourse.name.localeCompare(secondCourse.name),
  );
}
