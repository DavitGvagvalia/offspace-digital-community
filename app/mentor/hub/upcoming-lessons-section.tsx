import { CalendarClock } from "lucide-react";

import { formatDateTime } from "../../_lib/dates";
import type { MentorHubLesson } from "../_data/hub";

export function UpcomingLessonsSection({
  lessons,
}: {
  lessons: MentorHubLesson[];
}) {
  const nextLessons = lessons.slice(0, 5);

  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-sage-50 text-forest ring-1 ring-sage-200"
          aria-hidden="true"
        >
          <CalendarClock className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Next lessons
          </p>
          {nextLessons.length === 0 ? (
            <>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                No lesson scheduled
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                No upcoming lessons were found for your assigned groups.
              </p>
            </>
          ) : (
            <div className="mt-4 divide-y divide-stone-200">
              {nextLessons.map((item) => (
                <article
                  key={item.lesson.id}
                  className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)]"
                >
                  <time
                    dateTime={item.lesson.date}
                    className="text-sm font-bold text-forest"
                  >
                    {formatDateTime(item.lesson.date)}
                  </time>
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-semibold text-ink">
                      {item.lesson.title ?? item.course?.name ?? "Lesson"}
                    </h2>
                    <p className="mt-1 text-sm text-ink-soft">
                      {item.course?.name ?? item.group.courseId} /{" "}
                      {item.group.name ?? item.group.id}
                    </p>
                    {item.lesson.description ? (
                      <p className="mt-2 text-sm leading-6 text-ink-soft">
                        {item.lesson.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
