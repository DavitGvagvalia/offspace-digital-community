"use client";

import { useEffect, useMemo, useState } from "react";

import { AccessError, LoadingState } from "../components/auth-states";
import { StatePanel } from "../components/state-panel";
import { useRequiredProfile } from "../components/use-required-profile";
import { addAttendance, deleteAttendance } from "../services/attendance.services";
import { getMentorGroupWorkspaces } from "../services/mentor-workspace.services";
import type { MentorGroupWorkspace } from "../types/mentor-workspace.types";
import {
  GroupWorkspace,
  MentorGroupList,
  type AttendanceToggleRequest,
} from "./mentor-workspace-components";

export function MentorDashboard() {
  const { user, profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("mentor");
  const [workspaces, setWorkspaces] = useState<MentorGroupWorkspace[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingAttendanceIds, setPendingAttendanceIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadMentorGroups() {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const nextWorkspaces = await getMentorGroupWorkspaces(user.uid);

        if (isMounted) {
          setWorkspaces(nextWorkspaces);
          setSelectedGroupId(nextWorkspaces[0]?.group.id ?? "");
        }
      } catch (loadError) {
        console.error(loadError);

        if (isMounted) {
          setError("We could not load your mentor workspace right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMentorGroups();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const selectedWorkspace = useMemo(() => {
    return workspaces.find((workspace) => workspace.group.id === selectedGroupId);
  }, [selectedGroupId, workspaces]);

  async function handleToggleAttendance(request: AttendanceToggleRequest) {
    if (!user) {
      return;
    }

    const workspace = workspaces.find(
      (currentWorkspace) => currentWorkspace.group.id === request.groupId,
    );

    if (!workspace || workspace.group.mentorId !== user.uid) {
      setActionError("This group is not available for your mentor account.");
      return;
    }

    const studentIsAssigned = workspace.students.some(
      (student) => student.id === request.studentId,
    );
    const lessonIsInGroup = workspace.lessons.some(
      (lesson) => lesson.id === request.lessonId,
    );

    if (!studentIsAssigned || !lessonIsInGroup) {
      setActionError("Attendance can only be changed for this group's students and lessons.");
      return;
    }

    const existingAttendance = workspace.attendances.find((attendance) => {
      return (
        attendance.studentId === request.studentId &&
        attendance.lessonId === request.lessonId
      );
    });
    const pendingId =
      existingAttendance?.id ?? `${request.studentId}_${request.lessonId}`;

    if (pendingAttendanceIds.includes(pendingId)) {
      return;
    }

    try {
      setActionError(null);
      setPendingAttendanceIds((currentIds) => [...currentIds, pendingId]);

      if (existingAttendance) {
        await deleteAttendance(existingAttendance.id);

        setWorkspaces((currentWorkspaces) =>
          currentWorkspaces.map((currentWorkspace) => {
            if (currentWorkspace.group.id !== workspace.group.id) {
              return currentWorkspace;
            }

            return {
              ...currentWorkspace,
              attendances: currentWorkspace.attendances.filter(
                (attendance) => attendance.id !== existingAttendance.id,
              ),
            };
          }),
        );
      } else {
        const createdAttendance = await addAttendance({
          studentId: request.studentId,
          courseId: workspace.group.courseId,
          groupId: workspace.group.id,
          lessonId: request.lessonId,
        });

        setWorkspaces((currentWorkspaces) =>
          currentWorkspaces.map((currentWorkspace) => {
            if (currentWorkspace.group.id !== workspace.group.id) {
              return currentWorkspace;
            }

            return {
              ...currentWorkspace,
              attendances: [
                ...currentWorkspace.attendances.filter(
                  (attendance) => attendance.id !== createdAttendance.id,
                ),
                createdAttendance,
              ],
            };
          }),
        );
      }
    } catch (toggleError) {
      console.error(toggleError);
      setActionError("We could not update attendance. Check your connection and try again.");
    } finally {
      setPendingAttendanceIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== pendingId),
      );
    }
  }

  if (isAuthLoading) {
    return <LoadingState title="Loading mentor hub" />;
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
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Mentor hub
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            {profile.name} {profile.lastName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Your workspace only includes groups assigned to your mentor account.
          </p>
        </header>

        {isLoading ? (
          <StatePanel title="Loading groups" text="Checking your assigned groups." />
        ) : error ? (
          <StatePanel title="Workspace unavailable" text={error} />
        ) : workspaces.length === 0 ? (
          <StatePanel title="No assigned groups" text="No groups were found for this mentor account yet." />
        ) : (
          <section className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <MentorGroupList
              workspaces={workspaces}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
            />

            {selectedWorkspace ? (
              <GroupWorkspace
                workspace={selectedWorkspace}
                actionError={actionError}
                pendingAttendanceIds={pendingAttendanceIds}
                onToggleAttendance={handleToggleAttendance}
              />
            ) : (
              <StatePanel title="No group selected" text="Choose a group to see schedule and attendance." />
            )}
          </section>
        )}
      </section>
    </main>
  );
}
