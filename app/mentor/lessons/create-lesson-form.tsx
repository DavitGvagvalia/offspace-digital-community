"use client";

import { useState, type FormEvent } from "react";

import type { MentorGroupWorkspace } from "../_types/workspace";
import { EmptyBox } from "./empty-box";
import {
  formatCurrentLocalDateTimeInput,
  getStudentName,
  parseLocalDateTimeInput,
} from "./lesson-utils";

export type LessonCreateRequest = {
  groupId: string;
  title: string;
  description: string;
  date: string;
  attendedStudentIds: string[];
};

export function CreateLessonForm({
  workspace,
  isPending,
  onCreateLesson,
}: {
  workspace: MentorGroupWorkspace;
  isPending: boolean;
  onCreateLesson: (request: LessonCreateRequest) => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateInput, setDateInput] = useState(formatCurrentLocalDateTimeInput);
  const [attendedStudentIds, setAttendedStudentIds] = useState<string[]>([]);
  const parsedDate = parseLocalDateTimeInput(dateInput);
  const hasStudents = workspace.students.length > 0;
  const canSave = Boolean(title.trim()) && Boolean(parsedDate) && hasStudents && !isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!parsedDate || !canSave) {
      return;
    }

    try {
      await onCreateLesson({
        groupId: workspace.group.id,
        title,
        description,
        date: parsedDate.toISOString(),
        attendedStudentIds,
      });
      setTitle("");
      setDescription("");
      setDateInput(formatCurrentLocalDateTimeInput());
      setAttendedStudentIds([]);
    } catch {
      // The page owns the user-facing action error.
    }
  }

  function handleMarkEverybodyAttended() {
    setAttendedStudentIds(workspace.students.map((student) => student.id));
  }

  function handleToggleStudent(studentId: string) {
    setAttendedStudentIds((currentIds) => {
      if (currentIds.includes(studentId)) {
        return currentIds.filter((currentId) => currentId !== studentId);
      }

      return [...currentIds, studentId];
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-stone-200 bg-ivory-light p-4"
    >
      <div className="grid gap-3">
        <label className="block text-sm font-semibold text-ink">
          Lesson name
          <input
            required
            value={title}
            disabled={isPending}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-wait disabled:opacity-70"
          />
        </label>

        <label className="block text-sm font-semibold text-ink">
          Description
          <textarea
            value={description}
            disabled={isPending}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-1 w-full resize-y rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-wait disabled:opacity-70"
          />
        </label>

        <label className="block text-sm font-semibold text-ink">
          Date
          <input
            required
            type="datetime-local"
            value={dateInput}
            disabled={isPending}
            onChange={(event) => setDateInput(event.target.value)}
            className="mt-1 w-full rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-wait disabled:opacity-70"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xs border border-stone-200 bg-offwhite p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">Attendance</p>
          <button
            type="button"
            disabled={isPending || !hasStudents}
            onClick={handleMarkEverybodyAttended}
            className="inline-flex min-h-8 items-center justify-center rounded-xs border border-stone-200 bg-ivory-light px-3 py-1 text-xs font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            Everybody attended
          </button>
        </div>

        {!hasStudents ? (
          <EmptyBox text="Students must be assigned before creating a lesson." />
        ) : (
          <div className="space-y-2">
            {workspace.students.map((student) => {
              const checked = attendedStudentIds.includes(student.id);

              return (
                <label
                  key={student.id}
                  className="flex min-h-10 items-center justify-between gap-3 rounded-xs border border-stone-200 bg-ivory-light px-3 py-2 text-sm font-semibold text-ink"
                >
                  <span className="min-w-0">{getStudentName(student)}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={isPending}
                    onChange={() => handleToggleStudent(student.id)}
                    className="h-4 w-4 accent-forest disabled:cursor-wait"
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSave}
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xs bg-forest px-4 py-2 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving" : "Save lesson"}
      </button>
    </form>
  );
}
