import type { Attendance } from "../_types/attendance";
import type { Lesson } from "../_types/lesson";
import type { MentorGroupWorkspace } from "./_types/workspace";
import type { Student } from "../_types/student";

export type AttendanceToggleRequest = {
  groupId: string;
  studentId: string;
  lessonId: string;
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
  onToggleAttendance,
}: {
  workspace: MentorGroupWorkspace;
  actionError: string | null;
  pendingAttendanceIds: string[];
  onToggleAttendance: (request: AttendanceToggleRequest) => void;
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
        <SchedulePanel lessons={workspace.lessons} />
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

function SchedulePanel({ lessons }: { lessons: Lesson[] }) {
  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-ink">Schedule</h3>
      {lessons.length === 0 ? (
        <EmptyBox text="No lessons were found for this group." />
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <article
              key={lesson.id}
              className="rounded-sm border border-stone-200 bg-ivory-light p-4"
            >
              <p className="font-semibold text-ink">{formatLessonDate(lesson.date)}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {lesson.title ?? `Lesson ID: ${lesson.id}`}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
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
                    {student.name} {student.lastName}
                  </td>
                  {workspace.lessons.map((lesson) => {
                    const attendance = workspace.attendances.find((currentAttendance) => {
                      return (
                        currentAttendance.studentId === student.id &&
                        currentAttendance.lessonId === lesson.id
                      );
                    });
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
      aria-label={`${attended ? "Clear" : "Mark"} attendance for ${student.name} ${student.lastName} on ${formatShortLessonDate(lesson.date)}`}
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

function formatLessonDate(date: Lesson["date"]) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date.toDate());
}

function formatShortLessonDate(date: Lesson["date"]) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date.toDate());
}
