"use client";

import { useState } from "react";

import { AccessError, LoadingState } from "../components/auth-states";
import { StatePanel } from "../components/state-panel";
import { useRequiredProfile } from "../components/use-required-profile";
import { useSessionCachedQuery } from "../_lib/session-cache";
import type { Course } from "../_types/course";
<<<<<<< HEAD
<<<<<<< HEAD
import type { Enrollment } from "../_types/enrollment";
import { enrollCurrentStudentInCourses } from "./_data/enrollment-actions";
import { getStudentEnrollmentState } from "./_data/enrollments";
=======
=======
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)
import {
  enrollStudentInCourses,
  getStudentEnrollmentState,
  type StudentEnrollmentState,
} from "./_data/enrollments";
<<<<<<< HEAD
>>>>>>> 33d4dbc (Refactor student and super-admin portals to use session caching for data fetching)

const navItems = [
  {
    href: "/student/lessons",
    title: "Lessons",
    text: "Review scheduled lessons and your attendance status.",
  },
  {
    href: "/student/courses",
    title: "Courses",
    text: "See your active course enrollments and group details.",
  },
  {
    href: "/student/profile",
    title: "Profile",
    text: "View the basic student information connected to your account.",
  },
];
=======
import { StudentNavigation } from "./student-navigation";
<<<<<<< HEAD
>>>>>>> 350f812 (feat: enhance student registration and navigation experience)
=======
=======
import type { Enrollment } from "../_types/enrollment";
import { enrollCurrentStudentInCourses } from "./_data/enrollment-actions";
import { getStudentEnrollmentState } from "./_data/enrollments";

const navItems = [
  {
    href: "/student/lessons",
    title: "Lessons",
    text: "Review scheduled lessons and your attendance status.",
  },
  {
    href: "/student/courses",
    title: "Courses",
    text: "See your active course enrollments and group details.",
  },
  {
    href: "/student/profile",
    title: "Profile",
    text: "View the basic student information connected to your account.",
  },
];
>>>>>>> 8b40a4a (feat: enhance student enrollment process with server actions and improve documentation)
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)

export default function StudentPage() {
  const { user, profile, isLoading, error } = useRequiredProfile("student");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isSubmittingCourses, setIsSubmittingCourses] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const enrollmentStateQuery = useSessionCachedQuery<StudentEnrollmentState>({
    key: user ? `student:${user.id}:enrollment-state` : null,
    enabled: Boolean(user),
    fetcher: () => {
      if (!user) {
        return Promise.resolve({
          enrollments: [],
          availableCourses: [],
        });
      }

      return getStudentEnrollmentState(user.id);
    },
  });
  const enrollments = enrollmentStateQuery.data?.enrollments ?? [];
  const availableCourses = enrollmentStateQuery.data?.availableCourses ?? [];
  const loadError =
    enrollmentError ??
    (enrollmentStateQuery.error
      ? "We could not load available courses right now."
      : null);

  async function handleEnrollInCourses() {
    if (!user || selectedCourseIds.length === 0) {
      return;
    }

    try {
      setIsSubmittingCourses(true);
      setEnrollmentError(null);

      const createdEnrollments =
        await enrollCurrentStudentInCourses(selectedCourseIds);

      enrollmentStateQuery.setLocalData({
        enrollments: createdEnrollments,
        availableCourses: [],
      });
      setSelectedCourseIds([]);
    } catch (submitError) {
      console.error(submitError);
      setEnrollmentError("We could not enroll you in those courses right now.");
    } finally {
      setIsSubmittingCourses(false);
    }
  }

  function toggleCourseSelection(courseId: string) {
    setSelectedCourseIds((currentIds) =>
      currentIds.includes(courseId)
        ? currentIds.filter((currentId) => currentId !== courseId)
        : [...currentIds, courseId],
    );
  }

  if (isLoading) {
    return <LoadingState title="Loading student hub" />;
  }

  if (error || !user || !profile) {
    return (
      <AccessError
        message={error ?? "We could not load your student profile."}
        loginHref="/student/login"
      />
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Student hub
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            {profile.name} {profile.lastName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Open your lessons, enrolled courses, or profile.
          </p>
        </header>

        <StudentNavigation />

        {enrollmentStateQuery.isLoading ? (
          <StatePanel
            title="Checking enrollments"
            text="Loading your course enrollment status."
          />
        ) : loadError ? (
          <StatePanel title="Course selection unavailable" text={loadError} />
        ) : enrollments.length === 0 ? (
          <CourseSelectionPanel
            courses={availableCourses}
            selectedCourseIds={selectedCourseIds}
            isSubmitting={isSubmittingCourses}
            onToggleCourse={toggleCourseSelection}
            onSubmit={handleEnrollInCourses}
          />
        ) : null}
      </section>
    </main>
  );
}

function CourseSelectionPanel({
  courses,
  selectedCourseIds,
  isSubmitting,
  onToggleCourse,
  onSubmit,
}: {
  courses: Course[];
  selectedCourseIds: string[];
  isSubmitting: boolean;
  onToggleCourse: (courseId: string) => void;
  onSubmit: () => void;
}) {
  if (courses.length === 0) {
    return (
      <StatePanel
        title="No active courses"
        text="There are no active courses available for enrollment right now."
      />
    );
  }

  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Course selection
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            Choose your courses
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Select one or more active courses. Your mentor will assign group soon.
          </p>
        </div>
        <button
          type="button"
          disabled={selectedCourseIds.length === 0 || isSubmitting}
          onClick={onSubmit}
          className="rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Enrolling..." : "Enroll selected"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {courses.map((course) => {
          const isSelected = selectedCourseIds.includes(course.id);

          return (
            <button
              key={course.id}
              type="button"
              onClick={() => onToggleCourse(course.id)}
              aria-pressed={isSelected}
              className={`rounded-sm border p-4 text-left transition ${
                isSelected
                  ? "border-forest bg-sage-50 ring-2 ring-forest/15"
                  : "border-stone-200 bg-ivory-light hover:border-sage-300"
              }`}
            >
              <span className="flex items-start gap-3">
                <span
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-xs border ${
                    isSelected
                      ? "border-forest bg-forest text-ivory"
                      : "border-stone-300 bg-offwhite"
                  }`}
                  aria-hidden="true"
                >
                  {isSelected ? "x" : ""}
                </span>
                <span className="min-w-0">
                  <span className="block break-words font-semibold text-ink">
                    {course.name}
                  </span>
                  {course.description ? (
                    <span className="mt-1 block text-sm leading-6 text-ink-soft">
                      {course.description}
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
