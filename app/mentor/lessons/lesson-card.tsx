"use client";

import { useMemo, useState, type FormEvent } from "react";

import type { Lesson } from "../../_types/lesson";
import type { MentorGroupWorkspace } from "../_types/workspace";
import { AttendanceButton, type AttendanceToggleRequest } from "./attendance-button";
import { EmptyBox } from "./empty-box";
import {
  formatLessonDate,
  formatLessonTimelineDate,
  getStudentName,
} from "./lesson-utils";

export type LessonUpdateRequest = {
  groupId: string;
  lessonId: string;
  title: string;
  description: string;
};

export function MentorLessonCard({
  lesson,
  workspace,
  isPendingLessonSave,
  pendingAttendanceIds,
  onToggleAttendance,
  onUpdateLesson,
}: {
  lesson: Lesson;
  workspace: MentorGroupWorkspace;
  isPendingLessonSave: boolean;
  pendingAttendanceIds: string[];
  onToggleAttendance: (request: AttendanceToggleRequest) => void;
  onUpdateLesson: (request: LessonUpdateRequest) => Promise<void> | void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title ?? "");
  const [description, setDescription] = useState(lesson.description ?? "");
  const attendancesByStudentId = useMemo(() => {
    return new Map(
      workspace.attendances
        .filter((attendance) => attendance.lessonId === lesson.id)
        .map((attendance) => [attendance.studentId, attendance] as const),
    );
  }, [lesson.id, workspace.attendances]);
  const presentCount = workspace.students.filter((student) =>
    attendancesByStudentId.has(student.id),
  ).length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await onUpdateLesson({
        groupId: workspace.group.id,
        lessonId: lesson.id,
        title,
        description,
      });
      setIsEditing(false);
    } catch {
      // The page owns the user-facing action error.
    }
  }

  function handleCancelEdit() {
    setTitle(lesson.title ?? "");
    setDescription(lesson.description ?? "");
    setIsEditing(false);
  }

  function handleStartEdit() {
    setTitle(lesson.title ?? "");
    setDescription(lesson.description ?? "");
    setIsEditing(true);
  }

  return (
    <article className="grid grid-cols-[4.75rem_1.25rem_minmax(0,1fr)] gap-3 sm:grid-cols-[7rem_1.5rem_minmax(0,1fr)] sm:gap-4">
      <time
        dateTime={lesson.date}
        className="pt-4 text-right text-xs font-bold leading-5 text-ink-soft sm:text-sm"
      >
        {formatLessonTimelineDate(lesson.date)}
      </time>

      <div className="relative flex justify-center">
        <span className="absolute bottom-0 top-0 w-px bg-sage-200" aria-hidden="true" />
        <span
          className="relative mt-4 h-4 w-4 rounded-full border-4 border-offwhite bg-forest"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 rounded-sm border border-stone-200 bg-ivory-light p-4">
        <button
          type="button"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          className="w-full text-left focus:outline-none focus:ring-2 focus:ring-forest/20"
          aria-expanded={isOpen}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-ink">
                {lesson.title ?? `Lesson ID: ${lesson.id}`}
              </p>
              {lesson.description ? (
                <p className="mt-1 text-sm leading-6 text-ink-soft">
                  {lesson.description}
                </p>
              ) : null}
            </div>
            <span className="inline-flex min-h-8 shrink-0 items-center rounded-xs bg-sage-50 px-3 py-1 text-xs font-bold text-ink-soft ring-1 ring-sage-200">
              {presentCount}/{workspace.students.length} present
            </span>
          </div>
        </button>

        {isOpen ? (
          <div className="mt-4 space-y-4 border-t border-stone-200 pt-4">
            {isEditing ? (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-ink">
                  Lesson name
                  <input
                    value={title}
                    disabled={isPendingLessonSave}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-1 w-full rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-wait disabled:opacity-70"
                    placeholder={`Lesson ID: ${lesson.id}`}
                  />
                </label>

                <label className="block text-sm font-semibold text-ink">
                  Description
                  <textarea
                    value={description}
                    disabled={isPendingLessonSave}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={3}
                    className="mt-1 w-full resize-y rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-wait disabled:opacity-70"
                    placeholder="No description yet."
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={isPendingLessonSave}
                    className="inline-flex min-h-9 items-center justify-center rounded-xs bg-forest px-4 py-2 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-wait disabled:opacity-70"
                  >
                    {isPendingLessonSave ? "Saving" : "Save"}
                  </button>
                  <button
                    type="button"
                    disabled={isPendingLessonSave}
                    onClick={handleCancelEdit}
                    className="inline-flex min-h-9 items-center justify-center rounded-xs border border-stone-200 bg-offwhite px-4 py-2 text-sm font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink disabled:cursor-wait disabled:opacity-70"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm text-ink-soft">
                <div>
                  <p>Date: {formatLessonDate(lesson.date)}</p>
                  <p>
                    Description:{" "}
                    {lesson.description ? lesson.description : "No description yet."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex min-h-8 items-center justify-center rounded-xs border border-stone-200 bg-ivory-light px-3 py-1 text-xs font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink"
                >
                  Edit
                </button>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Students</p>
              {workspace.students.length === 0 ? (
                <EmptyBox text="No students are assigned to this group yet." />
              ) : (
                <div className="space-y-2">
                  {workspace.students.map((student) => {
                    const attendance = attendancesByStudentId.get(student.id);
                    const pendingId =
                      attendance?.id ?? `${student.id}_${lesson.id}`;

                    return (
                      <div
                        key={student.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xs border border-stone-200 bg-offwhite px-3 py-2"
                      >
                        <p className="min-w-0 text-sm font-semibold text-ink">
                          {getStudentName(student)}
                        </p>
                        <AttendanceButton
                          attendance={attendance}
                          student={student}
                          lesson={lesson}
                          groupId={workspace.group.id}
                          isPending={pendingAttendanceIds.includes(pendingId)}
                          onToggleAttendance={onToggleAttendance}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
