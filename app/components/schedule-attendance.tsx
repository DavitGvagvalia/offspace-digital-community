import { copy } from "../lib/copy";
import {
  formatDate,
  formatShortDate,
  getAttendanceStatus,
  type AttendanceStatus,
  type Language,
  type Lesson,
  type LessonStatus,
  type Student,
} from "../lib/demo-data";

const statusClasses: Record<AttendanceStatus | LessonStatus, string> = {
  present: "bg-success/10 text-success ring-success/20",
  absent: "bg-danger/10 text-danger ring-danger/20",
  late: "bg-warning/10 text-warning ring-warning/20",
  excused: "bg-sky-100 text-sky-800 ring-sky-200",
  notMarked: "bg-stone-100 text-stone-600 ring-stone-200",
  upcoming: "bg-sky-100 text-sky-800 ring-sky-200",
  completed: "bg-success/10 text-success ring-success/20",
  cancelled: "bg-danger/10 text-danger ring-danger/20",
};

export function ScheduleList({
  lessons,
  language,
}: {
  lessons: Lesson[];
  language: Language;
}) {
  const t = copy[language];

  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-ink">{t.schedule}</h3>
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <article
            key={lesson.id}
            className="rounded-sm border border-stone-200 bg-ivory-light p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{formatDate(lesson.date, language)}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {lesson.startTime} - {lesson.endTime}
                </p>
              </div>
              <StatusPill label={t[lesson.status]} status={lesson.status} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TeacherAttendance({
  lessons,
  students,
  language,
}: {
  lessons: Lesson[];
  students: Student[];
  language: Language;
}) {
  const t = copy[language];

  return (
    <section className="min-w-0">
      <h3 className="mb-3 text-xl font-semibold text-ink">{t.attendance}</h3>
      <div className="overflow-x-auto rounded-sm border border-stone-200">
        <table className="w-full min-w-[34rem] border-collapse bg-offwhite text-left text-sm">
          <thead className="bg-sage-50 text-xs uppercase tracking-[0.14em] text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-bold">{t.studentName}</th>
              {lessons.map((lesson) => (
                <th key={lesson.id} className="px-4 py-3 font-bold">
                  {formatShortDate(lesson.date, language)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-stone-200">
                <td className="px-4 py-3 font-semibold text-ink">{student.name}</td>
                {lessons.map((lesson) => {
                  const status = getAttendanceStatus(lesson.id, student.id);

                  return (
                    <td key={lesson.id} className="px-4 py-3">
                      <StatusPill label={t[status]} status={status} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function StudentAttendance({
  lessons,
  studentId,
  language,
}: {
  lessons: Lesson[];
  studentId: string;
  language: Language;
}) {
  const t = copy[language];

  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-ink">{t.attendance}</h3>
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const status = getAttendanceStatus(lesson.id, studentId);

          return (
            <article
              key={lesson.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-stone-200 bg-ivory-light p-4"
            >
              <div>
                <p className="font-semibold text-ink">{formatDate(lesson.date, language)}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {lesson.startTime} - {lesson.endTime}
                </p>
              </div>
              <StatusPill label={t[status]} status={status} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StatusPill({
  label,
  status,
}: {
  label: string;
  status: AttendanceStatus | LessonStatus;
}) {
  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-xs px-3 py-1 text-xs font-bold ring-1 ${statusClasses[status]}`}
    >
      {label}
    </span>
  );
}
