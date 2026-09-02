"use client";

import type { Attendance } from "../../_types/attendance";
import type { MentorGroupWorkspace } from "../_types/workspace";
import { AttendanceButton, type AttendanceToggleRequest } from "./attendance-button";
import { EmptyBox } from "./empty-box";
import { getStudentName, formatShortLessonDate } from "./lesson-utils";

export function AttendanceSection({
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
      <h2 className="mb-3 text-xl font-semibold text-ink">Attendance</h2>
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
                    const pendingId =
                      attendance?.id ?? `${student.id}_${lesson.id}`;

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

function getAttendanceForStudentLesson(
  attendances: Attendance[],
  studentId: string,
  lessonId: string,
) {
  return attendances.find((attendance) => {
    return attendance.studentId === studentId && attendance.lessonId === lessonId;
  });
}
