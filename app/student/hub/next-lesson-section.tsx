import { CalendarClock } from "lucide-react";

import { formatDateTime } from "../../_lib/dates";
import type { StudentHubLesson } from "../_data/hub";

export function NextLessonSection({
  nextLesson,
}: {
  nextLesson: StudentHubLesson | null;
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-sage-50 text-forest ring-1 ring-sage-200"
          aria-hidden="true"
        >
          <CalendarClock className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Next lesson
          </p>
          {nextLesson ? (
            <>
              <h2 className="mt-2 text-2xl font-semibold text-ink-soft">
                {formatDateTime(nextLesson.lesson.date)}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Course: {nextLesson.course.name}
              </p>
              <h2 className="mt-2 break-words text-2xl font-semibold text-ink">
                {nextLesson.lesson.title ?? nextLesson.course.name}
              </h2>
              {nextLesson.lesson.description ? (
                <p className="mt-3 text-sm leading-6 text-ink-soft">
                  {nextLesson.lesson.description}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                No lesson scheduled
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                No upcoming lessons were found for your assigned groups.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
