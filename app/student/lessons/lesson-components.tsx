"use client";

import { useState } from "react";

import type { StudentCourse, StudentLesson } from "../_types/lessons";
import { formatLessonDate, getCourseTitle } from "./lesson-utils";

export function CourseTabs({
  studentCourses,
  selectedCourseId,
  onSelectCourse,
}: {
  studentCourses: StudentCourse[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-2">
        {studentCourses.map((studentCourse) => {
          const { course } = studentCourse;
          const isSelected = studentCourse.id === selectedCourseId;

          return (
            <button
              key={studentCourse.id}
              type="button"
              onClick={() => onSelectCourse(studentCourse.id)}
              className={`rounded-sm border px-4 py-3 text-sm font-semibold transition ${
                isSelected
                  ? "border-forest bg-forest text-ivory"
                  : "border-stone-200 bg-offwhite text-ink-soft hover:border-sage-300 hover:text-ink"
              }`}
            >
              {getCourseTitle(course)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LessonsPanel({
  selectedCourse,
  lessons,
}: {
  selectedCourse: StudentCourse;
  lessons: StudentLesson[];
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            Course
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">
            {getCourseTitle(selectedCourse.course)}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            {selectedCourse.groupId
              ? `Group ${selectedCourse.groupId}`
              : "Pending group assignment"}
          </p>
        </div>
        <span className="rounded-xs bg-sage-50 px-3 py-2 text-xs font-bold text-ink-soft ring-1 ring-sage-200">
          {lessons.length} lessons
        </span>
      </div>

      {!selectedCourse.groupId ? (
        <StatePanel
          title="Group assignment pending"
          text="Your mentor will assign group soon."
        />
      ) : lessons.length === 0 ? (
        <StatePanel
          title="No past lessons"
          text="This course is connected to your group, but no past lessons were found yet."
        />
      ) : (
        <div className="relative space-y-4 before:absolute before:bottom-4 before:left-3 before:top-4 before:w-px before:bg-sage-200">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </section>
  );
}

export function LessonCard({ lesson }: { lesson: StudentLesson }) {
  const attended = Boolean(lesson.attendance);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="group relative pl-10">
      <span
        className={`absolute left-0 top-4 z-10 h-6 w-6 rounded-full border-4 border-offwhite ${
          attended ? "bg-success" : "bg-stone-300"
        }`}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="w-full rounded-sm border border-stone-200 bg-ivory-light p-4 text-left transition hover:border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest/20"
        aria-expanded={isOpen}
      >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">
            {lesson.lesson.title ?? `Lesson ID: ${lesson.lesson.id}`}
          </p>
          {lesson.lesson.description ? (
            <p className="mt-1 text-sm text-ink-soft">
              {lesson.lesson.description}
            </p>
          ) : null}
        </div>
        <span
          className={`inline-flex min-h-8 items-center rounded-xs px-3 py-1 text-xs font-bold ring-1 ${
            attended
              ? "bg-success/10 text-success ring-success/20"
              : "bg-stone-100 text-stone-600 ring-stone-200"
          }`}
        >
          {attended ? "Attended" : "Not attended"}
        </span>
      </div>
      <div
        className={`mt-3 rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm text-ink-soft ${
          isOpen ? "block" : "hidden group-hover:block group-focus-within:block"
        }`}
      >
        <p>Date: {formatLessonDate(lesson.lesson.date)}</p>
        <p>Attendance: {attended ? "Attended" : "Not attended"}</p>
      </div>
      </button>
    </article>
  );
}

export function StatePanel({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
    </section>
  );
}
