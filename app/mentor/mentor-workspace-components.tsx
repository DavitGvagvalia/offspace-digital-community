import type { Lesson } from "../types/lesson.types";
import type { MentorGroupWorkspace } from "../types/mentor-workspace.types";

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
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export function GroupWorkspace({ workspace }: { workspace: MentorGroupWorkspace }) {
  return (
    <section className="min-w-0 rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="mb-5">
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SchedulePanel lessons={workspace.lessons} />
        <AttendancePanel workspace={workspace} />
      </div>
    </section>
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

function AttendancePanel({ workspace }: { workspace: MentorGroupWorkspace }) {
  return (
    <section className="min-w-0">
      <h3 className="mb-3 text-xl font-semibold text-ink">Attendance</h3>
      {workspace.students.length === 0 || workspace.lessons.length === 0 ? (
        <EmptyBox text="Attendance appears after this group has students and lessons." />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-stone-200">
          <table className="w-full min-w-[34rem] border-collapse bg-offwhite text-left text-sm">
            <thead className="bg-sage-50 text-xs uppercase tracking-[0.14em] text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-bold">Student</th>
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
                  <td className="px-4 py-3 font-semibold text-ink">
                    {student.name} {student.lastName}
                  </td>
                  {workspace.lessons.map((lesson) => {
                    const attended = workspace.attendances.some((attendance) => {
                      return (
                        attendance.studentId === student.id &&
                        attendance.lessonId === lesson.id
                      );
                    });

                    return (
                      <td key={lesson.id} className="px-4 py-3">
                        <AttendancePill attended={attended} />
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

function AttendancePill({ attended }: { attended: boolean }) {
  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-xs px-3 py-1 text-xs font-bold ring-1 ${
        attended
          ? "bg-success/10 text-success ring-success/20"
          : "bg-stone-100 text-stone-600 ring-stone-200"
      }`}
    >
      {attended ? "Present" : "Not marked"}
    </span>
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
