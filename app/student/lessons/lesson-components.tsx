import type { AttendedLesson } from "../../services/queries.services";
import type { StudentCourse } from "./lesson-types";
import { formatLessonDate, getCourseTitle } from "./lesson-utils";

export function CourseTabs({
  studentCourses,
  selectedCourseId,
  onSelectCourse,
}: {
  studentCourses: StudentCourse[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-2">
        {studentCourses.map((studentCourse) => {
          const { course } = studentCourse;
          const isSelected = studentCourse.id === selectedCourseId;

          return (
            <button
              key={studentCourse.id}
              type="button"
              onClick={() => onSelectCourse(studentCourse.id)}
              className={`rounded-sm border px-4 py-3 text-sm font-semibold transition ${
                isSelected
                  ? "border-forest bg-forest text-ivory"
                  : "border-stone-200 bg-offwhite text-ink-soft hover:border-sage-300 hover:text-ink"
              }`}
            >
              {getCourseTitle(course)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LessonsPanel({
  selectedCourse,
  lessons,
}: {
  selectedCourse: StudentCourse;
  lessons: AttendedLesson[];
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            Course
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">
            {getCourseTitle(selectedCourse.course)}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Group {selectedCourse.groupId}
          </p>
        </div>
        <span className="rounded-xs bg-sage-50 px-3 py-2 text-xs font-bold text-ink-soft ring-1 ring-sage-200">
          {lessons.length} lessons
        </span>
      </div>

      {lessons.length === 0 ? (
        <StatePanel
          title="No attended lessons"
          text="This course is connected to the student, but it does not have attended lessons yet."
        />
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.attendance.id} lesson={lesson} />
          ))}
        </div>
      )}
    </section>
  );
}

export function LessonCard({ lesson }: { lesson: AttendedLesson }) {
  return (
    <article className="rounded-sm border border-stone-200 bg-ivory-light p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">
            {formatLessonDate(lesson.lesson.date)}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {lesson.lesson.title ?? `Lesson ID: ${lesson.lesson.id}`}
          </p>
        </div>
        <span className="inline-flex min-h-8 items-center rounded-xs bg-success/10 px-3 py-1 text-xs font-bold text-success ring-1 ring-success/20">
          Attended
        </span>
      </div>
    </article>
  );
}

export function StatePanel({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
    </section>
  );
}
