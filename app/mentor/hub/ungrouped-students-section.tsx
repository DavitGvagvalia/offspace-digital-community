import { ArrowRight, UsersRound } from "lucide-react";
import Link from "next/link";

import type { MentorEnrollmentStudent } from "../_types/workspace";

export function UngroupedStudentsSection({
  students,
}: {
  students: MentorEnrollmentStudent[];
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-sage-50 text-forest ring-1 ring-sage-200"
            aria-hidden="true"
          >
            <UsersRound className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
              Students without a group
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {students.length}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              Active enrollments in your courses that are waiting for group
              assignment.
            </p>
          </div>
        </div>

        <Link
          href="/mentor/groups"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-sm bg-forest px-4 py-2 text-sm font-bold text-ivory transition hover:bg-forest-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          <span>Open groups</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      {students.length > 0 ? (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {students.slice(0, 6).map(({ enrollment, student }) => (
            <li
              key={enrollment.id}
              className="rounded-sm border border-stone-200 bg-ivory-light px-3 py-3"
            >
              <p className="font-semibold text-ink">
                {student.name} {student.lastName}
              </p>
              <p className="mt-1 break-words text-xs text-ink-muted">
                {student.email ?? "No email"}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
