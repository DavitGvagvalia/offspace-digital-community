import { Video } from "lucide-react";

import { formatShortDateTime } from "../../_lib/dates";
import type { StudentHubLesson } from "../_data/hub";

export function CatchUpSection({
  missedLessons,
}: {
  missedLessons: StudentHubLesson[];
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-sage-50 text-forest ring-1 ring-sage-200"
          aria-hidden="true"
        >
          <Video className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Catch up
          </p>

          {missedLessons.length === 0 ? (
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              No missed lessons were found.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {missedLessons.map((missedLesson) => (
                <article
                  key={missedLesson.lesson.id}
                  className="rounded-sm border border-stone-200 bg-ivory-light p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-ink">
                        {missedLesson.lesson.title ?? missedLesson.course.name}
                      </h3>
                      <p className="mt-1 text-sm text-ink-soft">
                        {missedLesson.course.name}
                      </p>
                    </div>
                    <time
                      dateTime={missedLesson.lesson.date}
                      className="shrink-0 text-sm font-semibold text-ink-soft"
                    >
                      {formatShortDateTime(missedLesson.lesson.date)}
                    </time>
                  </div>
                  <p className="mt-3 rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm text-ink-soft">
                    Recording will appear here when lesson recordings are
                    available.
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
