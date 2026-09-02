"use client";

import type { Attendance } from "../../_types/attendance";
import type { Lesson } from "../../_types/lesson";
import type { Student } from "../../_types/student";
import { formatShortLessonDate, getStudentName } from "./lesson-utils";

export type AttendanceToggleRequest = {
  groupId: string;
  studentId: string;
  lessonId: string;
};

export function AttendanceButton({
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
