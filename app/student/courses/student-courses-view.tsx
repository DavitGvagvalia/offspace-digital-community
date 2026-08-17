"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AccessError, LoadingState } from "../../components/auth-states";
import { StatePanel } from "../../components/state-panel";
import { useRequiredProfile } from "../../components/use-required-profile";
import { getStudentCourseSummaries } from "../../services/student-courses.services";
import type { StudentCourseSummary } from "../../types/student-course-summary.types";
import { CourseCard } from "./course-card";

export function StudentCoursesView() {
  const { user, profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("student");
  const [courses, setCourses] = useState<StudentCourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const summaries = await getStudentCourseSummaries(user.uid);

        if (isMounted) {
          setCourses(summaries);
        }
      } catch (loadError) {
        console.error(loadError);

        if (isMounted) {
          setError("We could not load your courses right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isAuthLoading) {
    return <LoadingState title="Loading courses" />;
  }

  if (authError || !user || !profile) {
    return (
      <AccessError
        message={authError ?? "We could not load your student profile."}
        loginHref="/student/login"
      />
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <Link href="/student" className="text-sm font-semibold text-forest hover:text-forest-light">
            Student hub
          </Link>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            Student courses
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            My enrolled courses
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Courses are loaded from enrollments assigned to your student account.
          </p>
        </header>

        {isLoading ? (
          <StatePanel title="Loading courses" text="Checking your enrollments." />
        ) : error ? (
          <StatePanel title="Courses unavailable" text={error} />
        ) : courses.length === 0 ? (
          <StatePanel title="No courses found" text="No enrollments were found for this student yet." />
        ) : (
          <div className="grid gap-3">
            {courses.map((summary) => (
              <CourseCard key={summary.enrollment.id} summary={summary} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
