"use client";

import { StatePanel } from "../../components/state-panel";
import type { Course } from "../../_types/course";

export function CourseSelectionPanel({
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
            Select one or more active courses. Your mentor will assign group
            soon.
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
