"use client";

import type { MentorGroupWorkspace } from "../_types/workspace";
import { type AttendanceToggleRequest } from "./attendance-button";
import { CreateLessonForm, type LessonCreateRequest } from "./create-lesson-form";
import { EmptyBox } from "./empty-box";
import { MentorLessonCard, type LessonUpdateRequest } from "./lesson-card";

export function LessonScheduleSection({
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
      <h2 className="mb-3 text-xl font-semibold text-ink">Schedule</h2>
      <CreateLessonForm
        key={workspace.group.id}
        workspace={workspace}
        isPending={isPendingLessonCreate}
        onCreateLesson={onCreateLesson}
      />
      {workspace.lessons.length === 0 ? (
        <div className="mt-4">
          <EmptyBox text="No lessons were found for this group." />
        </div>
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
