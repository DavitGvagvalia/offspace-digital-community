"use client";

import { useState } from "react";

import { AccessError, LoadingState } from "../../components/auth-states";
import { StatePanel } from "../../components/state-panel";
import { useRequiredProfile } from "../../components/use-required-profile";
import {
  clearSessionDataCache,
  useSessionCachedQuery,
} from "../../_lib/session-cache";
import {
  assignEnrollmentToMentorGroup,
  createMentorGroup,
  getMentorGroupManagementState,
  unassignEnrollmentFromMentorGroup,
  updateMentorGroup,
} from "../_data/courses";
import type { MentorGroupManagementState } from "../_types/workspace";
import { MentorNavigation, MentorPageTitle } from "../mentor-navigation";
import { CreateGroupSection, type GroupCreateRequest } from "./create-group-section";
import {
  GroupEditorSection,
  type GroupAssignRequest,
  type GroupUpdateRequest,
} from "./group-editor-section";

const emptyState: MentorGroupManagementState = {
  courses: [],
  workspaces: [],
  ungroupedStudents: [],
};

export function MentorGroupsView() {
  const { user, profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("mentor");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingCreate, setPendingCreate] = useState(false);
  const [pendingGroupIds, setPendingGroupIds] = useState<string[]>([]);
  const [pendingEnrollmentIds, setPendingEnrollmentIds] = useState<string[]>([]);
  const stateQuery = useSessionCachedQuery<MentorGroupManagementState>({
    key: user ? `mentor:${user.id}:group-management-state` : null,
    enabled: Boolean(user),
    fetcher: () => {
      if (!user) {
        return Promise.resolve(emptyState);
      }

      return getMentorGroupManagementState(user.id);
    },
  });
  const state = stateQuery.data ?? emptyState;

  async function handleCreateGroup(request: GroupCreateRequest) {
    if (!user || pendingCreate) {
      return;
    }

    try {
      setPendingCreate(true);
      setActionError(null);
      await createMentorGroup({
        mentorId: user.id,
        courseId: request.courseId,
        name: request.name,
        active: request.active,
      });
      await reloadMentorGroups(user.id);
    } catch (createError) {
      console.error(createError);
      setActionError("We could not create this group right now.");
    } finally {
      setPendingCreate(false);
    }
  }

  async function handleUpdateGroup(request: GroupUpdateRequest) {
    if (!user || pendingGroupIds.includes(request.groupId)) {
      return;
    }

    try {
      setPendingGroupIds((currentIds) => [...currentIds, request.groupId]);
      setActionError(null);
      await updateMentorGroup({
        mentorId: user.id,
        courseId: request.courseId,
        groupId: request.groupId,
        name: request.name,
        active: request.active,
      });
      await reloadMentorGroups(user.id);
    } catch (updateError) {
      console.error(updateError);
      setActionError("We could not update this group right now.");
    } finally {
      setPendingGroupIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== request.groupId),
      );
    }
  }

  async function handleAssignStudent(request: GroupAssignRequest) {
    if (!user || pendingEnrollmentIds.includes(request.enrollmentId)) {
      return;
    }

    try {
      setPendingEnrollmentIds((currentIds) => [
        ...currentIds,
        request.enrollmentId,
      ]);
      setActionError(null);
      await assignEnrollmentToMentorGroup({
        mentorId: user.id,
        enrollmentId: request.enrollmentId,
        groupId: request.groupId,
      });
      await reloadMentorGroups(user.id);
    } catch (assignError) {
      console.error(assignError);
      setActionError("We could not add this student to the group right now.");
    } finally {
      setPendingEnrollmentIds((currentIds) =>
        currentIds.filter(
          (currentId) => currentId !== request.enrollmentId,
        ),
      );
    }
  }

  async function handleRemoveStudent(enrollmentId: string) {
    if (!user || pendingEnrollmentIds.includes(enrollmentId)) {
      return;
    }

    try {
      setPendingEnrollmentIds((currentIds) => [...currentIds, enrollmentId]);
      setActionError(null);
      await unassignEnrollmentFromMentorGroup({
        mentorId: user.id,
        enrollmentId,
      });
      await reloadMentorGroups(user.id);
    } catch (removeError) {
      console.error(removeError);
      setActionError("We could not remove this student from the group right now.");
    } finally {
      setPendingEnrollmentIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== enrollmentId),
      );
    }
  }

  async function reloadMentorGroups(mentorId: string) {
    clearMentorCaches(mentorId);
    await stateQuery.revalidate();
  }

  if (isAuthLoading) {
    return <LoadingState title="Loading groups" />;
  }

  if (authError || !user || !profile) {
    return (
      <AccessError
        message={authError ?? "We could not load your mentor profile."}
        loginHref="/mentor/login"
      />
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <MentorNavigation />
        <MentorPageTitle
          title="Groups"
          text="Create groups, update group details, and manage student assignment."
        />

        {actionError ? (
          <p className="rounded-sm border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {actionError}
          </p>
        ) : null}

        {stateQuery.isLoading ? (
          <StatePanel
            title="Loading groups"
            text="Checking your groups, courses, and ungrouped students."
          />
        ) : stateQuery.error ? (
          <StatePanel
            title="Groups unavailable"
            text="We could not load your groups right now."
          />
        ) : (
          <>
            <CreateGroupSection
              courses={state.courses}
              isSubmitting={pendingCreate}
              onCreateGroup={handleCreateGroup}
            />
            <GroupEditorSection
              workspaces={state.workspaces}
              ungroupedStudents={state.ungroupedStudents}
              pendingGroupIds={pendingGroupIds}
              pendingEnrollmentIds={pendingEnrollmentIds}
              onUpdateGroup={handleUpdateGroup}
              onAssignStudent={handleAssignStudent}
              onRemoveStudent={handleRemoveStudent}
            />
          </>
        )}
      </section>
    </main>
  );
}

function clearMentorCaches(mentorId: string) {
  clearSessionDataCache(`mentor:${mentorId}:course-rosters`);
  clearSessionDataCache(`mentor:${mentorId}:group-management-state`);
  clearSessionDataCache(`mentor:${mentorId}:group-workspaces`);
  clearSessionDataCache(`mentor:${mentorId}:hub-state`);
}
