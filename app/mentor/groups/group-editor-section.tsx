"use client";

import { useState, type FormEvent } from "react";

import type { MentorEnrollmentStudent, MentorGroupWorkspace } from "../_types/workspace";

export type GroupUpdateRequest = {
  courseId: string;
  groupId: string;
  name: string;
  active: boolean;
};

export type GroupAssignRequest = {
  enrollmentId: string;
  groupId: string;
};

export function GroupEditorSection({
  workspaces,
  ungroupedStudents,
  pendingGroupIds,
  pendingEnrollmentIds,
  onUpdateGroup,
  onAssignStudent,
  onRemoveStudent,
}: {
  workspaces: MentorGroupWorkspace[];
  ungroupedStudents: MentorEnrollmentStudent[];
  pendingGroupIds: string[];
  pendingEnrollmentIds: string[];
  onUpdateGroup: (request: GroupUpdateRequest) => Promise<void> | void;
  onAssignStudent: (request: GroupAssignRequest) => Promise<void> | void;
  onRemoveStudent: (enrollmentId: string) => Promise<void> | void;
}) {
  if (workspaces.length === 0) {
    return (
      <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-ink">No groups found</h2>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          Create a group before assigning students.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {workspaces.map((workspace) => (
        <GroupEditorCard
          key={workspace.group.id}
          workspace={workspace}
          ungroupedStudents={ungroupedStudents.filter(
            (item) => item.enrollment.courseId === workspace.group.courseId,
          )}
          isGroupPending={pendingGroupIds.includes(workspace.group.id)}
          pendingEnrollmentIds={pendingEnrollmentIds}
          onUpdateGroup={onUpdateGroup}
          onAssignStudent={onAssignStudent}
          onRemoveStudent={onRemoveStudent}
        />
      ))}
    </section>
  );
}

function GroupEditorCard({
  workspace,
  ungroupedStudents,
  isGroupPending,
  pendingEnrollmentIds,
  onUpdateGroup,
  onAssignStudent,
  onRemoveStudent,
}: {
  workspace: MentorGroupWorkspace;
  ungroupedStudents: MentorEnrollmentStudent[];
  isGroupPending: boolean;
  pendingEnrollmentIds: string[];
  onUpdateGroup: (request: GroupUpdateRequest) => Promise<void> | void;
  onAssignStudent: (request: GroupAssignRequest) => Promise<void> | void;
  onRemoveStudent: (enrollmentId: string) => Promise<void> | void;
}) {
  const [name, setName] = useState(workspace.group.name ?? "");
  const [active, setActive] = useState(workspace.group.active);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(
    ungroupedStudents[0]?.enrollment.id ?? "",
  );
  const activeEnrollmentId = ungroupedStudents.some(
    (item) => item.enrollment.id === selectedEnrollmentId,
  )
    ? selectedEnrollmentId
    : ungroupedStudents[0]?.enrollment.id ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onUpdateGroup({
      courseId: workspace.group.courseId,
      groupId: workspace.group.id,
      name,
      active,
    });
  }

  async function handleAssignStudent() {
    if (!activeEnrollmentId) {
      return;
    }

    await onAssignStudent({
      enrollmentId: activeEnrollmentId,
      groupId: workspace.group.id,
    });
  }

  return (
    <article className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_auto]"
      >
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            {workspace.course?.name ?? workspace.group.courseId}
          </p>
          <label className="mt-2 block text-sm font-semibold text-ink">
            Group name
            <input
              value={name}
              disabled={isGroupPending}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xs border border-stone-200 bg-ivory-light px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-wait disabled:opacity-70"
            />
          </label>
        </div>

        <label className="flex items-end gap-3 pb-2 text-sm font-semibold text-ink lg:justify-center">
          <input
            type="checkbox"
            checked={active}
            disabled={isGroupPending}
            onChange={(event) => setActive(event.target.checked)}
            className="h-4 w-4 accent-forest disabled:cursor-wait"
          />
          Active
        </label>

        <button
          type="submit"
          disabled={isGroupPending}
          className="inline-flex min-h-10 items-center justify-center self-end rounded-sm bg-forest px-4 py-2 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-wait disabled:opacity-70"
        >
          {isGroupPending ? "Saving" : "Save group"}
        </button>
      </form>

      <section className="mt-5 rounded-sm border border-stone-200 bg-ivory-light p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="block flex-1 text-sm font-semibold text-ink">
            Add student
            <select
              value={activeEnrollmentId}
              disabled={ungroupedStudents.length === 0}
              onChange={(event) => setSelectedEnrollmentId(event.target.value)}
              className="mt-2 w-full rounded-xs border border-stone-200 bg-offwhite px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {ungroupedStudents.length === 0 ? (
                <option value="">No ungrouped students</option>
              ) : null}
              {ungroupedStudents.map(({ enrollment, student }) => (
                <option key={enrollment.id} value={enrollment.id}>
                  {student.name} {student.lastName}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!activeEnrollmentId}
            onClick={handleAssignStudent}
            className="inline-flex min-h-10 items-center justify-center rounded-sm bg-forest px-4 py-2 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add to group
          </button>
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-ink">Students</h3>
          <span className="rounded-xs bg-sage-50 px-3 py-1 text-xs font-bold text-ink-soft ring-1 ring-sage-200">
            {workspace.enrollmentStudents.length}
          </span>
        </div>
        {workspace.enrollmentStudents.length === 0 ? (
          <p className="rounded-sm border border-stone-200 bg-ivory-light px-3 py-3 text-sm text-ink-soft">
            No students are assigned to this group yet.
          </p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {workspace.enrollmentStudents.map(({ enrollment, student }) => {
              const isPending = pendingEnrollmentIds.includes(enrollment.id);

              return (
                <li
                  key={enrollment.id}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">
                      {student.name} {student.lastName}
                    </p>
                    <p className="mt-1 break-words text-sm text-ink-soft">
                      {student.email ?? "No email"}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onRemoveStudent(enrollment.id)}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-sm border border-danger/30 px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger/10 disabled:cursor-wait disabled:opacity-70"
                  >
                    {isPending ? "Removing" : "Remove"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}
