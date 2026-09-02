"use client";

import { AccessError, LoadingState } from "../../components/auth-states";
import { StatePanel } from "../../components/state-panel";
import { useRequiredProfile } from "../../components/use-required-profile";
import { useSessionCachedQuery } from "../../_lib/session-cache";
import { getStudentCourseSummaries } from "../_data/courses";
import type { StudentCourseSummary } from "../_types/course-summary";
import { StudentNavigation } from "../student-navigation";
import { CourseCard } from "./course-card";

export function StudentCoursesView() {
  const { user, profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("student");
  const coursesQuery = useSessionCachedQuery<StudentCourseSummary[]>({
    key: user ? `student:${user.id}:course-summaries` : null,
    enabled: Boolean(user),
    fetcher: () => {
      if (!user) {
        return Promise.resolve([]);
      }

      return getStudentCourseSummaries(user.id);
    },
  });
  const courses = coursesQuery.data ?? [];

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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            Student courses
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            My enrolled courses
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Courses are loaded from enrollments assigned to your student account.
          </p>
        </header>

        <StudentNavigation />

        {coursesQuery.isLoading ? (
          <StatePanel title="Loading courses" text="Checking your enrollments." />
        ) : coursesQuery.error ? (
          <StatePanel title="Courses unavailable" text="We could not load your courses right now." />
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