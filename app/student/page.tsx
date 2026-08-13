"use client";

import { useState } from "react";

import { AppFrame, WorkspaceShell } from "../components/app-frame";
import { ScheduleList, StudentAttendance } from "../components/schedule-attendance";
import { copy } from "../lib/copy";
import {
  getCourse,
  getLessonsForAssignment,
  studentAssignmentsByCourse,
  studentCourseIds,
  students,
  type Language,
} from "../lib/demo-data";

export default function StudentPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedCourseId, setSelectedCourseId] = useState(studentCourseIds[0]);
  const t = copy[language];
  const selectedCourse = getCourse(selectedCourseId);
  const assignmentId = studentAssignmentsByCourse[selectedCourseId];
  const studentLessons = getLessonsForAssignment(assignmentId);
  const currentStudent = students[0];

  return (
    <AppFrame
      language={language}
      onLanguageChange={setLanguage}
      eyebrow={t.studentSubtitle}
      title={t.studentDashboard}
    >
      <section className="flex flex-1 flex-col gap-5 py-6">
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2">
            {studentCourseIds.map((courseId) => {
              const tabCourse = getCourse(courseId);
              const isSelected = courseId === selectedCourseId;

              return (
                <button
                  key={courseId}
                  type="button"
                  onClick={() => setSelectedCourseId(courseId)}
                  className={`rounded-sm border px-4 py-3 text-sm font-semibold transition ${
                    isSelected
                      ? "border-forest bg-forest text-ivory"
                      : "border-stone-200 bg-offwhite text-ink-soft hover:border-sage-300 hover:text-ink"
                  }`}
                >
                  {tabCourse.title}
                </button>
              );
            })}
          </div>
        </div>

        <WorkspaceShell
          eyebrow={currentStudent.name}
          title={selectedCourse.title}
          subtitle={t.studentSubtitle}
        >
          <ScheduleList lessons={studentLessons} language={language} />
          <StudentAttendance
            lessons={studentLessons}
            studentId={currentStudent.id}
            language={language}
          />
        </WorkspaceShell>
      </section>
    </AppFrame>
  );
}
