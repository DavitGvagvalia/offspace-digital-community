"use client";

import { useEffect, useMemo, useState } from "react";

import { CourseTabs, LessonsPanel, StatePanel } from "./lesson-components";
import { sortAttendedLessons } from "./lesson-utils";
import { getStudentLessonCourses } from "./student-lessons-data";
import type { StudentCourse } from "./lesson-types";

export function StudentLessonsView({ studentId }: { studentId: string }) {
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStudentCourses() {
      try {
        setIsLoading(true);
        setError(null);

        const nextStudentCourses = await getStudentLessonCourses(studentId);

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
  }, [studentId]);

  const selectedCourse = studentCourses.find(
    (item) => item.id === selectedCourseId,
  );

  const selectedLessons = useMemo(() => {
    return sortAttendedLessons(selectedCourse?.lessons ?? []);
  }, [selectedCourse]);

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            Student lessons
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            My enrolled courses
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Choose an enrolled course to see its attendance-connected lessons.
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
            text="Choose an active course to see attended lessons."
          />
        )}
      </section>
    </main>
  );
}
