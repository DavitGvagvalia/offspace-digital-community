"use client";

import { useState } from "react";

import { toMillis } from "../../_lib/dates";
import type { StudentCourse, StudentLesson } from "../_types/lessons";
import {
  formatLessonDate,
  formatLessonTimelineDate,
  getCourseTitle,
} from "./lesson-utils";

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
            {!selectedCourse.groupId &&"Pending group assignment"}
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
          title="No lessons"
          text="This course is connected to your group, but no lessons were found yet."
        />
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </section>
  );
}

export function LessonCard({ lesson }: { lesson: StudentLesson }) {
  const attendanceStatus = getAttendanceStatus(lesson);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="group grid grid-cols-[4.75rem_1.25rem_minmax(0,1fr)] gap-3 sm:grid-cols-[7rem_1.5rem_minmax(0,1fr)] sm:gap-4">
      <time
        dateTime={lesson.lesson.date}
        className="pt-4 text-right text-xs font-bold leading-5 text-ink-soft sm:text-sm"
      >
        {formatLessonTimelineDate(lesson.lesson.date)}
      </time>

      <div className="relative flex justify-center">
        <span className="absolute bottom-0 top-0 w-px bg-sage-200" aria-hidden="true" />
        <span
          className={`relative mt-4 h-4 w-4 rounded-full border-4 border-offwhite ${
            attendanceStatus.dotClassName
          }`}
          aria-hidden="true"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="min-w-0 rounded-sm border border-stone-200 bg-ivory-light p-4 text-left transition hover:border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest/20"
        aria-expanded={isOpen}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-ink">
              {lesson.lesson.title ?? `Lesson ID: ${lesson.lesson.id}`}
            </p>
            {lesson.lesson.description ? (
              <p className="mt-1 text-sm leading-6 text-ink-soft">
                {lesson.lesson.description}
              </p>
            ) : null}
          </div>
          <span
            className={`inline-flex min-h-8 shrink-0 items-center rounded-xs px-3 py-1 text-xs font-bold ring-1 ${
              attendanceStatus.badgeClassName
            }`}
          >
            {attendanceStatus.label}
          </span>
        </div>

        <div
          className={`mt-3 rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm text-ink-soft  ${
            isOpen ? "block" : "hidden group-active:block group-focus-within:block"
          }`}
        >
          <p>Date: {formatLessonDate(lesson.lesson.date)}</p>
          <p>Attendance: {attendanceStatus.label}</p>
        </div>
      </button>
    </article>
  );
}

function getAttendanceStatus(lesson: StudentLesson) {
  if (lesson.attendance) {
    return {
      label: "Attended",
      dotClassName: "bg-success",
      badgeClassName: "bg-success/10 text-success ring-success/20",
    };
  }

  if (toMillis(lesson.lesson.date) > Date.now()) {
    return {
      label: "Awaiting",
      dotClassName: "bg-warning",
      badgeClassName: "bg-warning/10 text-warning ring-warning/20",
    };
  }

  return {
    label: "Absent",
    dotClassName: "bg-danger",
    badgeClassName: "bg-danger/10 text-danger ring-danger/20",
  };
}

export function StatePanel({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
    </section>
  );
}
