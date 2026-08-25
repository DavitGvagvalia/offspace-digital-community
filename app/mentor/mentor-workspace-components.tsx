"use client";

import { useMemo, useState, type FormEvent } from "react";

import type { Attendance } from "../_types/attendance";
import {
  formatDateTime,
  formatShortDate,
  formatShortDateTime,
} from "../_lib/dates";
import type { Lesson } from "../_types/lesson";
import type { MentorGroupWorkspace } from "./_types/workspace";
import type { Student } from "../_types/student";

export type AttendanceToggleRequest = {
  groupId: string;
  studentId: string;
  lessonId: string;
};

export type LessonUpdateRequest = {
  groupId: string;
  lessonId: string;
  title: string;
  description: string;
};

export type LessonCreateRequest = {
  groupId: string;
  title: string;
  description: string;
  date: string;
  attendedStudentIds: string[];
};

export function MentorGroupList({
  workspaces,
  selectedGroupId,
  onSelectGroup,
}: {
  workspaces: MentorGroupWorkspace[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
}) {
  return (
    <aside className="rounded-md border border-stone-200 bg-offwhite p-4 shadow-sm">
      <h2 className="text-2xl font-semibold text-ink">My groups</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Private student assignments are not modeled yet.
      </p>
      <div className="mt-5 space-y-2">
        {workspaces.map((workspace) => {
          const isSelected = workspace.group.id === selectedGroupId;

          return (
            <button
              key={workspace.group.id}
              type="button"
              onClick={() => onSelectGroup(workspace.group.id)}
              className={`w-full rounded-sm border px-3 py-3 text-left transition ${
                isSelected
                  ? "border-forest bg-forest text-ivory"
                  : "border-stone-200 bg-ivory-light text-ink-soft hover:border-sage-300 hover:text-ink"
              }`}
            >
              <span className="block text-sm font-semibold">
                {workspace.group.name ?? workspace.group.id}
              </span>
              <span
                className={`mt-1 block text-xs ${
                  isSelected ? "text-ivory-dark" : "text-ink-muted"
                }`}
              >
                {workspace.course?.name ?? workspace.group.courseId}
              </span>
              <span
                className={`mt-3 block text-xs ${
                  isSelected ? "text-ivory-dark" : "text-ink-muted"
                }`}
              >
                {workspace.students.length} students / {workspace.lessons.length} lessons
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export function GroupWorkspace({
  workspace,
  actionError,
  pendingAttendanceIds,
  pendingLessonIds,
  pendingLessonCreateGroupIds,
  onCreateLesson,
  onToggleAttendance,
  onUpdateLesson,
}: {
  workspace: MentorGroupWorkspace;
  actionError: string | null;
  pendingAttendanceIds: string[];
  pendingLessonIds: string[];
  pendingLessonCreateGroupIds: string[];
  onCreateLesson: (request: LessonCreateRequest) => Promise<void> | void;
  onToggleAttendance: (request: AttendanceToggleRequest) => void;
  onUpdateLesson: (request: LessonUpdateRequest) => Promise<void> | void;
}) {
  const lessonIds = new Set(workspace.lessons.map((lesson) => lesson.id));
  const studentIds = new Set(workspace.students.map((student) => student.id));
  const markedAttendances = workspace.attendances.filter((attendance) => {
    return (
      studentIds.has(attendance.studentId) && lessonIds.has(attendance.lessonId)
    );
  }).length;
  const possibleAttendances = workspace.students.length * workspace.lessons.length;

  return (
    <section className="min-w-0 rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Assigned group
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">
            {workspace.group.name ?? workspace.group.id}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Course: {workspace.course?.name ?? workspace.group.courseId}
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-2 text-sm">
          <Metric label="Students" value={workspace.students.length} />
          <Metric label="Lessons" value={workspace.lessons.length} />
          <Metric
            label="Marked"
            value={
              possibleAttendances > 0
                ? `${markedAttendances}/${possibleAttendances}`
                : "0"
            }
          />
        </dl>
      </div>

      {actionError ? (
        <p className="mb-5 rounded-sm border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {actionError}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SchedulePanel
          workspace={workspace}
          pendingAttendanceIds={pendingAttendanceIds}
          pendingLessonIds={pendingLessonIds}
          isPendingLessonCreate={pendingLessonCreateGroupIds.includes(
            workspace.group.id,
          )}
          onCreateLesson={onCreateLesson}
          onToggleAttendance={onToggleAttendance}
          onUpdateLesson={onUpdateLesson}
        />
        <AttendancePanel
          workspace={workspace}
          pendingAttendanceIds={pendingAttendanceIds}
          onToggleAttendance={onToggleAttendance}
        />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-ivory-light px-3 py-2">
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-ink">{value}</dd>
    </div>
  );
}

function SchedulePanel({
  workspace,
  pendingAttendanceIds,
  pendingLessonIds,
  isPendingLessonCreate,
  onCreateLesson,
  onToggleAttendance,
  onUpdateLesson,
}: {
  workspace: MentorGroupWorkspace;
  pendingAttendanceIds: string[];
  pendingLessonIds: string[];
  isPendingLessonCreate: boolean;
  onCreateLesson: (request: LessonCreateRequest) => Promise<void> | void;
  onToggleAttendance: (request: AttendanceToggleRequest) => void;
  onUpdateLesson: (request: LessonUpdateRequest) => Promise<void> | void;
}) {
  return (
    <section className="min-w-0">
      <h3 className="mb-3 text-xl font-semibold text-ink">Schedule</h3>
      <CreateLessonForm
        key={workspace.group.id}
        workspace={workspace}
        isPending={isPendingLessonCreate}
        onCreateLesson={onCreateLesson}
      />
      {workspace.lessons.length === 0 ? (
        <EmptyBox text="No lessons were found for this group." />
      ) : (
        <div className="mt-4 space-y-4">
          {workspace.lessons.map((lesson) => (
            <MentorLessonCard
              key={lesson.id}
              lesson={lesson}
              workspace={workspace}
              isPendingLessonSave={pendingLessonIds.includes(lesson.id)}
              pendingAttendanceIds={pendingAttendanceIds}
              onToggleAttendance={onToggleAttendance}
              onUpdateLesson={onUpdateLesson}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CreateLessonForm({
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
      // The parent workspace owns the user-facing action error.
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
      className="mb-4 rounded-sm border border-stone-200 bg-ivory-light p-4"
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

function MentorLessonCard({
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
      // The parent workspace owns the user-facing action error.
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

function AttendancePanel({
  workspace,
  pendingAttendanceIds,
  onToggleAttendance,
}: {
  workspace: MentorGroupWorkspace;
  pendingAttendanceIds: string[];
  onToggleAttendance: (request: AttendanceToggleRequest) => void;
}) {
  return (
    <section className="min-w-0">
      <h3 className="mb-3 text-xl font-semibold text-ink">Attendance</h3>
      {workspace.students.length === 0 || workspace.lessons.length === 0 ? (
        <EmptyBox text="Attendance appears after this group has students and lessons." />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-stone-200">
          <table className="w-full min-w-[42rem] border-collapse bg-offwhite text-left text-sm">
            <thead className="bg-sage-50 text-xs uppercase tracking-[0.14em] text-ink-muted">
              <tr>
                <th className="sticky left-0 z-10 bg-sage-50 px-4 py-3 font-bold">
                  Student
                </th>
                {workspace.lessons.map((lesson) => (
                  <th key={lesson.id} className="px-4 py-3 font-bold">
                    {formatShortLessonDate(lesson.date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workspace.students.map((student) => (
                <tr key={student.id} className="border-t border-stone-200">
                  <td className="sticky left-0 z-10 bg-offwhite px-4 py-3 font-semibold text-ink">
                    {getStudentName(student)}
                  </td>
                  {workspace.lessons.map((lesson) => {
                    const attendance = getAttendanceForStudentLesson(
                      workspace.attendances,
                      student.id,
                      lesson.id,
                    );
                    const pendingId = attendance?.id ?? `${student.id}_${lesson.id}`;

                    return (
                      <td key={lesson.id} className="px-4 py-3">
                        <AttendanceButton
                          attendance={attendance}
                          student={student}
                          lesson={lesson}
                          groupId={workspace.group.id}
                          isPending={pendingAttendanceIds.includes(pendingId)}
                          onToggleAttendance={onToggleAttendance}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AttendanceButton({
  attendance,
  student,
  lesson,
  groupId,
  isPending,
  onToggleAttendance,
}: {
  attendance: Attendance | undefined;
  student: Student;
  lesson: Lesson;
  groupId: string;
  isPending: boolean;
  onToggleAttendance: (request: AttendanceToggleRequest) => void;
}) {
  const attended = Boolean(attendance);

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        onToggleAttendance({
          groupId,
          studentId: student.id,
          lessonId: lesson.id,
        })
      }
      className={`inline-flex min-h-8 min-w-24 items-center justify-center rounded-xs px-3 py-1 text-xs font-bold ring-1 transition disabled:cursor-wait disabled:opacity-70 ${
        attended
          ? "bg-success/10 text-success ring-success/20 hover:bg-success/15"
          : "bg-stone-100 text-stone-600 ring-stone-200 hover:bg-stone-200"
      }`}
      aria-label={`${attended ? "Clear" : "Mark"} attendance for ${getStudentName(
        student,
      )} on ${formatShortLessonDate(lesson.date)}`}
    >
      {isPending ? "Saving" : attended ? "Present" : "Not marked"}
    </button>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-ivory-light p-4 text-sm text-ink-soft">
      {text}
    </div>
  );
}

function getAttendanceForStudentLesson(
  attendances: Attendance[],
  studentId: string,
  lessonId: string,
) {
  return attendances.find((attendance) => {
    return attendance.studentId === studentId && attendance.lessonId === lessonId;
  });
}

function getStudentName(student: Student) {
  return `${student.name} ${student.lastName}`;
}

function formatCurrentLocalDateTimeInput() {
  const now = new Date();

  now.setSeconds(0, 0);

  return formatLocalDateTimeInput(now);
}

function formatLocalDateTimeInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseLocalDateTimeInput(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatLessonDate(date: Lesson["date"]) {
  return formatDateTime(date);
}

function formatLessonTimelineDate(date: Lesson["date"]) {
  return formatShortDateTime(date);
}

function formatShortLessonDate(date: Lesson["date"]) {
  return formatShortDate(date);
}
