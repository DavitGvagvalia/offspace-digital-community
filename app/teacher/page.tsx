"use client";

import { useState } from "react";

import { AppFrame, WorkspaceShell } from "../components/app-frame";
import { ScheduleList, TeacherAttendance } from "../components/schedule-attendance";
import { copy } from "../lib/copy";
import {
  getAssignmentTitle,
  getCourse,
  getLessonsForAssignment,
  getStudentsForAssignment,
  teacherAssignments,
  type Language,
  type TeacherAssignment,
} from "../lib/demo-data";

export default function TeacherPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(teacherAssignments[0].id);
  const t = copy[language];
  const selectedAssignment =
    teacherAssignments.find((assignment) => assignment.id === selectedAssignmentId) ??
    teacherAssignments[0];
  const groups = teacherAssignments.filter((item) => item.type === "group");
  const privateStudents = teacherAssignments.filter((item) => item.type === "private");
  const assignmentLessons = getLessonsForAssignment(selectedAssignment.id);
  const assignmentStudents = getStudentsForAssignment(selectedAssignment);
  const course = getCourse(selectedAssignment.courseId);

  return (
    <AppFrame
      language={language}
      onLanguageChange={setLanguage}
      eyebrow={t.teacherSubtitle}
      title={t.teacherDashboard}
    >
      <section className="grid flex-1 gap-5 py-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="rounded-md border border-stone-200 bg-offwhite p-4 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-ink">{t.teacher}</h2>
            <p className="mt-1 text-sm text-ink-soft">{t.teacherSubtitle}</p>
          </div>

          <AssignmentList
            title={t.groups}
            assignments={groups}
            selectedAssignmentId={selectedAssignmentId}
            onSelectAssignment={setSelectedAssignmentId}
          />
          <AssignmentList
            title={t.privateStudents}
            assignments={privateStudents}
            selectedAssignmentId={selectedAssignmentId}
            onSelectAssignment={setSelectedAssignmentId}
          />
        </aside>

        <WorkspaceShell
          eyebrow={selectedAssignment.type === "group" ? t.groupLabel : t.privateLabel}
          title={getAssignmentTitle(selectedAssignment)}
          subtitle={`${t.course}: ${course.title}`}
        >
          <ScheduleList lessons={assignmentLessons} language={language} />
          <TeacherAttendance
            lessons={assignmentLessons}
            students={assignmentStudents}
            language={language}
          />
        </WorkspaceShell>
      </section>
    </AppFrame>
  );
}

function AssignmentList({
  title,
  assignments,
  selectedAssignmentId,
  onSelectAssignment,
}: {
  title: string;
  assignments: TeacherAssignment[];
  selectedAssignmentId: string;
  onSelectAssignment: (assignmentId: string) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
        {title}
      </p>
      <div className="space-y-2">
        {assignments.map((assignment) => {
          const isSelected = assignment.id === selectedAssignmentId;

          return (
            <button
              key={assignment.id}
              type="button"
              onClick={() => onSelectAssignment(assignment.id)}
              className={`w-full rounded-sm border px-3 py-3 text-left transition ${
                isSelected
                  ? "border-forest bg-forest text-ivory"
                  : "border-stone-200 bg-ivory-light text-ink-soft hover:border-sage-300 hover:text-ink"
              }`}
            >
              <span className="block text-sm font-semibold">
                {getAssignmentTitle(assignment)}
              </span>
              <span
                className={`mt-1 block text-xs ${
                  isSelected ? "text-ivory-dark" : "text-ink-muted"
                }`}
              >
                {getCourse(assignment.courseId).title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
