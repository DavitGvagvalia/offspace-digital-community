import type { Attendance } from "../_types/attendance";
import { formatDateTime, formatShortDate } from "../_lib/dates";
import type { Course } from "../_types/course";
import type { Lesson } from "../_types/lesson";
import type {
  MentorGroupWorkspace,
  MentorPendingEnrollment,
} from "./_types/workspace";
import type { Student } from "../_types/student";

export type AttendanceToggleRequest = {
  groupId: string;
  studentId: string;
  lessonId: string;
};

export type GroupCreationRequest = {
  courseId: string;
  name: string;
  enrollmentIds: string[];
};

export function GroupCreationPanel({
  eligibleCourses,
  pendingEnrollments,
  selectedCourseId,
  groupName,
  selectedEnrollmentIds,
  isSubmitting,
  error,
  onCourseChange,
  onNameChange,
  onToggleEnrollment,
  onSubmit,
}: {
  eligibleCourses: Course[];
  pendingEnrollments: MentorPendingEnrollment[];
  selectedCourseId: string;
  groupName: string;
  selectedEnrollmentIds: string[];
  isSubmitting: boolean;
  error: string | null;
  onCourseChange: (courseId: string) => void;
  onNameChange: (name: string) => void;
  onToggleEnrollment: (enrollmentId: string) => void;
  onSubmit: (request: GroupCreationRequest) => void;
}) {
  const pendingForCourse = pendingEnrollments.filter(
    (pendingEnrollment) => pendingEnrollment.course.id === selectedCourseId,
  );

  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
          Groups
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Create group</h2>
      </div>

      {eligibleCourses.length === 0 ? (
        <EmptyBox text="No teaching courses assigned." />
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              courseId: selectedCourseId,
              name: groupName,
              enrollmentIds: selectedEnrollmentIds,
            });
          }}
        >
          <label className="block">
            <span className="text-sm font-semibold text-ink">Course</span>
            <select
              name="courseId"
              required
              value={selectedCourseId}
              onChange={(event) => onCourseChange(event.target.value)}
              className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
            >
              {eligibleCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink">Group name</span>
            <input
              type="text"
              name="name"
              value={groupName}
              onChange={(event) => onNameChange(event.target.value)}
              className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
            />
          </label>

          {pendingForCourse.length > 0 ? (
            <div className="mt-4">
              <p className="text-sm font-semibold text-ink">Students</p>
              <div className="mt-2 max-h-56 space-y-2 overflow-y-auto rounded-sm border border-stone-200 bg-ivory-light p-2">
                {pendingForCourse.map(({ enrollment, student }) => (
                  <label
                    key={enrollment.id}
                    className="flex items-start gap-3 rounded-sm bg-offwhite px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEnrollmentIds.includes(enrollment.id)}
                      onChange={() => onToggleEnrollment(enrollment.id)}
                      className="mt-1 h-4 w-4 rounded border-stone-300 text-forest focus:ring-forest"
                    />
                    <span className="min-w-0">
                      <span className="block break-words text-sm font-semibold text-ink">
                        {student.name} {student.lastName}
                      </span>
                      <span className="mt-1 block break-all text-xs text-ink-muted">
                        {student.email ?? student.id}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-sm border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !selectedCourseId}
            className="mt-6 w-full rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating group..." : "Create group"}
          </button>
        </form>
      )}
    </section>
  );
}

export function UnassignedStudentsPanel({
  pendingEnrollments,
}: {
  pendingEnrollments: MentorPendingEnrollment[];
}) {
  const courseGroups = pendingEnrollments.reduce<
    Array<{ course: Course; pendingEnrollments: MentorPendingEnrollment[] }>
  >((groups, pendingEnrollment) => {
    const existingGroup = groups.find(
      (group) => group.course.id === pendingEnrollment.course.id,
    );

    if (existingGroup) {
      existingGroup.pendingEnrollments.push(pendingEnrollment);
      return groups;
    }

    return [
      ...groups,
      {
        course: pendingEnrollment.course,
        pendingEnrollments: [pendingEnrollment],
      },
    ];
  }, []);

  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Students
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            Unassigned enrollments
          </h2>
        </div>
        <span className="rounded-sm bg-sage-100 px-3 py-1 text-sm font-bold text-forest">
          {pendingEnrollments.length}
        </span>
      </div>

      {courseGroups.length === 0 ? (
        <p className="mt-5 rounded-sm border border-stone-200 bg-ivory-light px-3 py-3 text-sm text-ink-soft">
          No unassigned enrolled students found.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {courseGroups.map((courseGroup) => (
            <article
              key={courseGroup.course.id}
              className="rounded-sm border border-stone-200 bg-ivory-light p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="break-words text-lg font-semibold text-ink">
                  {courseGroup.course.name}
                </h3>
                <span className="rounded-sm bg-offwhite px-3 py-1 text-sm font-bold text-forest">
                  {courseGroup.pendingEnrollments.length}
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {courseGroup.pendingEnrollments.map(({ enrollment, student }) => (
                  <li
                    key={enrollment.id}
                    className="rounded-sm border border-stone-200 bg-offwhite px-3 py-2"
                  >
                    <p className="break-words text-sm font-semibold text-ink">
                      {student.name} {student.lastName}
                    </p>
                    <p className="mt-1 break-all text-xs text-ink-muted">
                      {student.email ?? student.id}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

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
        Assigned course groups.
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
  return formatDateTime(date);
}

function formatShortLessonDate(date: Lesson["date"]) {
  return formatShortDate(date);
}
