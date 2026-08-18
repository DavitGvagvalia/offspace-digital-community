"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { AccessError, LoadingState } from "../../components/auth-states";
import { useRequiredProfile } from "../../components/use-required-profile";
import { getStudentLessonCourses } from "../_data/lessons";
import type { StudentCourse } from "../_types/lessons";
import { CourseTabs, LessonsPanel, StatePanel } from "./lesson-components";
import { sortStudentLessons } from "./lesson-utils";

export function StudentLessonsView() {
  const { user, profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("student");
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStudentCourses() {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const nextStudentCourses = await getStudentLessonCourses(user.uid);

        if (!isMounted) {
          return;
        }

        setStudentCourses(nextStudentCourses);
        setSelectedCourseId(nextStudentCourses[0]?.id ?? "");
      } catch (loadError) {
        console.error(loadError);

        if (isMounted) {
          setError("We could not load your lessons right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStudentCourses();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const selectedCourse = studentCourses.find(
    (item) => item.id === selectedCourseId,
  );

  const selectedLessons = useMemo(() => {
    return sortStudentLessons(selectedCourse?.lessons ?? []);
  }, [selectedCourse]);

  if (isAuthLoading) {
    return <LoadingState title="Loading lessons" />;
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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            Student lessons
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            My enrolled courses
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Choose an enrolled course to see scheduled lessons and your attendance.
          </p>
        </header>

        {isLoading ? (
          <StatePanel title="Loading lessons" text="Checking your courses and lesson history." />
        ) : error ? (
          <StatePanel title="Lessons unavailable" text={error} />
        ) : studentCourses.length === 0 ? (
          <StatePanel
            title="No enrolled courses"
            text="No enrollments were found for this student yet."
          />
        ) : selectedCourse ? (
          <>
            <CourseTabs
              studentCourses={studentCourses}
              selectedCourseId={selectedCourseId}
              onSelectCourse={setSelectedCourseId}
            />
            <LessonsPanel selectedCourse={selectedCourse} lessons={selectedLessons} />
          </>
        ) : (
          <StatePanel
            title="No course selected"
            text="Choose an active course to see scheduled lessons."
          />
        )}
      </section>
    </main>
  );
}
