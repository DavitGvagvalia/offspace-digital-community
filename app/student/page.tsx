"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AccessError, LoadingState } from "../components/auth-states";
import { StatePanel } from "../components/state-panel";
import { useRequiredProfile } from "../components/use-required-profile";
import type { Course } from "../_types/course";
import type { Enrollment } from "../_types/enrollment";
import {
  enrollStudentInCourses,
  getStudentEnrollmentState,
} from "./_data/enrollments";

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

export default function StudentPage() {
  const { user, profile, isLoading, error } = useRequiredProfile("student");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isLoadingEnrollmentState, setIsLoadingEnrollmentState] =
    useState(true);
  const [isSubmittingCourses, setIsSubmittingCourses] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEnrollmentState() {
      if (!user) {
        return;
      }

      try {
        setIsLoadingEnrollmentState(true);
        setEnrollmentError(null);

        const nextState = await getStudentEnrollmentState(user.uid);

        if (isMounted) {
          setEnrollments(nextState.enrollments);
          setAvailableCourses(nextState.availableCourses);
          setSelectedCourseIds([]);
        }
      } catch (loadError) {
        console.error(loadError);

        if (isMounted) {
          setEnrollmentError("We could not load available courses right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingEnrollmentState(false);
        }
      }
    }

    loadEnrollmentState();

    return () => {
      isMounted = false;
    };
  }, [user]);

  async function handleEnrollInCourses() {
    if (!user || selectedCourseIds.length === 0) {
      return;
    }

    try {
      setIsSubmittingCourses(true);
      setEnrollmentError(null);

      const createdEnrollments = await enrollStudentInCourses(
        user.uid,
        selectedCourseIds,
      );

      setEnrollments(createdEnrollments);
      setAvailableCourses([]);
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

        <nav className="grid gap-3 md:grid-cols-3" aria-label="Student navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm transition hover:border-sage-300 hover:shadow-md"
            >
              <span className="text-xl font-semibold text-ink">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-ink-soft">
                {item.text}
              </span>
            </Link>
          ))}
        </nav>

        {isLoadingEnrollmentState ? (
          <StatePanel
            title="Checking enrollments"
            text="Loading your course enrollment status."
          />
        ) : enrollmentError ? (
          <StatePanel title="Course selection unavailable" text={enrollmentError} />
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
