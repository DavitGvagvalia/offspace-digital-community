"use client";

import { useState, type FormEvent } from "react";

import type { Course } from "../../_types/course";

export type GroupCreateRequest = {
  courseId: string;
  name: string;
  active: boolean;
};

export function CreateGroupSection({
  courses,
  isSubmitting,
  onCreateGroup,
}: {
  courses: Course[];
  isSubmitting: boolean;
  onCreateGroup: (request: GroupCreateRequest) => Promise<void> | void;
}) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const activeCourseId = courses.some((course) => course.id === courseId)
    ? courseId
    : courses[0]?.id ?? "";
  const canSubmit = Boolean(activeCourseId) && Boolean(name.trim()) && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    await onCreateGroup({
      courseId: activeCourseId,
      name,
      active,
    });
    setName("");
    setActive(true);
  }

  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
          New group
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Create group</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="block text-sm font-semibold text-ink">
          Course
          <select
            value={activeCourseId}
            disabled={isSubmitting || courses.length === 0}
            onChange={(event) => setCourseId(event.target.value)}
            className="mt-2 w-full rounded-xs border border-stone-200 bg-ivory-light px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {courses.length === 0 ? (
              <option value="">No eligible courses</option>
            ) : null}
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-ink">
          Group name
          <input
            required
            value={name}
            disabled={isSubmitting}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xs border border-stone-200 bg-ivory-light px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-wait disabled:opacity-70"
          />
        </label>

        <label className="flex items-center gap-3 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={active}
            disabled={isSubmitting}
            onChange={(event) => setActive(event.target.checked)}
            className="h-4 w-4 accent-forest disabled:cursor-wait"
          />
          Active group
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-10 items-center justify-center rounded-sm bg-forest px-4 py-2 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating" : "Create group"}
        </button>
      </form>
    </section>
  );
}
