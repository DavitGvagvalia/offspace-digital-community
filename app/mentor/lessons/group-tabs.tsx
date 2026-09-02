"use client";

import { cn } from "../../_lib/ui/utils";
import type { MentorGroupWorkspace } from "../_types/workspace";

export function MentorGroupTabs({
  workspaces,
  selectedGroupId,
  onSelectGroup,
}: {
  workspaces: MentorGroupWorkspace[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-3 shadow-sm">
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {workspaces.map((workspace) => {
          const isSelected = workspace.group.id === selectedGroupId;

          return (
            <button
              key={workspace.group.id}
              type="button"
              onClick={() => onSelectGroup(workspace.group.id)}
              className={cn(
                "min-w-56 rounded-sm border px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:min-w-64",
                isSelected
                  ? "border-forest bg-forest text-ivory shadow-sm"
                  : "border-stone-200 bg-ivory-light text-ink-soft hover:border-sage-300 hover:bg-sage-50 hover:text-ink",
              )}
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
                {workspace.students.length} students /{" "}
                {workspace.lessons.length} lessons
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
