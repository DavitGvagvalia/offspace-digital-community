import Link from "next/link";

import type { StudentCourseSummary } from "../_types/course-summary";

export function CourseCard({ summary }: { summary: StudentCourseSummary }) {
  const { enrollment, course, group, mentor } = summary;

  return (
    <article className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            {enrollment.status}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            {course?.name ?? enrollment.courseId}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Group: {group?.name ?? enrollment.groupId}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Mentor: {mentor ? `${mentor.name} ${mentor.lastName}` : enrollment.mentorId}
          </p>
        </div>
        <Link
          href="/student/lessons"
          className="rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink"
        >
          View lessons
        </Link>
      </div>
    </article>
  );
}
