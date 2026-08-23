"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AccessError, LoadingState } from "../components/auth-states";
import { StatePanel } from "../components/state-panel";
import { useRequiredProfile } from "../components/use-required-profile";
import type { Course } from "../_types/course";
import { createMentorGroup } from "./_data/group-actions";
import { addAttendance, deleteAttendance } from "./_data/attendance";
import { getMentorDashboardWorkspace } from "./_data/workspace";
import type {
  MentorDashboardWorkspace,
  MentorGroupWorkspace,
  MentorPendingEnrollment,
} from "./_types/workspace";
import {
  GroupCreationPanel,
  GroupWorkspace,
  type GroupCreationRequest,
  MentorGroupList,
  UnassignedStudentsPanel,
  type AttendanceToggleRequest,
} from "./mentor-workspace-components";

export function MentorDashboard() {
  const { user, profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("mentor");
  const [workspaces, setWorkspaces] = useState<MentorGroupWorkspace[]>([]);
  const [eligibleCourses, setEligibleCourses] = useState<Course[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<
    MentorPendingEnrollment[]
  >([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [newGroupCourseId, setNewGroupCourseId] = useState("");
  const newGroupCourseIdRef = useRef("");
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedEnrollmentIds, setSelectedEnrollmentIds] = useState<string[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [groupCreationError, setGroupCreationError] = useState<string | null>(
    null,
  );
  const [pendingAttendanceIds, setPendingAttendanceIds] = useState<string[]>([]);

  const applyMentorDashboardWorkspace = useCallback(
    (nextWorkspace: MentorDashboardWorkspace, preferredGroupId?: string) => {
      const nextSelectedGroupId =
        preferredGroupId &&
        nextWorkspace.workspaces.some(
          (workspace) => workspace.group.id === preferredGroupId,
        )
          ? preferredGroupId
          : nextWorkspace.workspaces[0]?.group.id ?? "";
      const currentCourseId = newGroupCourseIdRef.current;
      const nextCourseId = nextWorkspace.eligibleCourses.some(
        (course) => course.id === currentCourseId,
      )
        ? currentCourseId
        : nextWorkspace.eligibleCourses[0]?.id ?? "";

      newGroupCourseIdRef.current = nextCourseId;
      setWorkspaces(nextWorkspace.workspaces);
      setEligibleCourses(nextWorkspace.eligibleCourses);
      setPendingEnrollments(nextWorkspace.pendingEnrollments);
      setSelectedGroupId(nextSelectedGroupId);
      setNewGroupCourseId(nextCourseId);
      setSelectedEnrollmentIds((currentEnrollmentIds) => {
        const pendingEnrollmentIds = new Set(
          nextWorkspace.pendingEnrollments
            .filter(
              (pendingEnrollment) =>
                pendingEnrollment.course.id === nextCourseId,
            )
            .map((pendingEnrollment) => pendingEnrollment.enrollment.id),
        );

        return currentEnrollmentIds.filter((enrollmentId) =>
          pendingEnrollmentIds.has(enrollmentId),
        );
      });
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadMentorGroups() {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const nextWorkspace = await getMentorDashboardWorkspace(user.id);

        if (isMounted) {
          applyMentorDashboardWorkspace(nextWorkspace);
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
  }, [applyMentorDashboardWorkspace, user]);

  const selectedWorkspace = useMemo(() => {
    return workspaces.find((workspace) => workspace.group.id === selectedGroupId);
  }, [selectedGroupId, workspaces]);

  const pendingEnrollmentsForSelectedCourse = useMemo(() => {
    return pendingEnrollments.filter(
      (pendingEnrollment) =>
        pendingEnrollment.course.id === newGroupCourseId,
    );
  }, [newGroupCourseId, pendingEnrollments]);

  function handleNewGroupCourseChange(courseId: string) {
    newGroupCourseIdRef.current = courseId;
    setNewGroupCourseId(courseId);
    setSelectedEnrollmentIds([]);
    setGroupCreationError(null);
  }

  function handleToggleSelectedEnrollment(enrollmentId: string) {
    setSelectedEnrollmentIds((currentEnrollmentIds) =>
      currentEnrollmentIds.includes(enrollmentId)
        ? currentEnrollmentIds.filter((currentEnrollmentId) => currentEnrollmentId !== enrollmentId)
        : [...currentEnrollmentIds, enrollmentId],
    );
  }

  async function handleCreateGroup(request: GroupCreationRequest) {
    if (!user) {
      return;
    }

    const validEnrollmentIds = new Set(
      pendingEnrollmentsForSelectedCourse.map(
        (pendingEnrollment) => pendingEnrollment.enrollment.id,
      ),
    );
    const enrollmentIds = request.enrollmentIds.filter((enrollmentId) =>
      validEnrollmentIds.has(enrollmentId),
    );

    try {
      setIsCreatingGroup(true);
      setGroupCreationError(null);
      setActionError(null);

      const createdGroup = await createMentorGroup({
        courseId: request.courseId,
        name: request.name,
        enrollmentIds,
      });
      const nextWorkspace = await getMentorDashboardWorkspace(user.id);

      applyMentorDashboardWorkspace(nextWorkspace, createdGroup.id);
      setNewGroupName("");
      setSelectedEnrollmentIds([]);
    } catch (createError) {
      console.error(createError);
      setGroupCreationError(
        createError instanceof Error
          ? createError.message
          : "We could not create that group right now.",
      );
    } finally {
      setIsCreatingGroup(false);
    }
  }

  async function handleToggleAttendance(request: AttendanceToggleRequest) {
    if (!user) {
      return;
    }

    const workspace = workspaces.find(
      (currentWorkspace) => currentWorkspace.group.id === request.groupId,
    );

    if (!workspace || workspace.group.mentorId !== user.id) {
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
        ) : (
          <>
            <section className="grid gap-5 lg:grid-cols-2">
              <GroupCreationPanel
                eligibleCourses={eligibleCourses}
                pendingEnrollments={pendingEnrollments}
                selectedCourseId={newGroupCourseId}
                groupName={newGroupName}
                selectedEnrollmentIds={selectedEnrollmentIds}
                isSubmitting={isCreatingGroup}
                error={groupCreationError}
                onCourseChange={handleNewGroupCourseChange}
                onNameChange={setNewGroupName}
                onToggleEnrollment={handleToggleSelectedEnrollment}
                onSubmit={handleCreateGroup}
              />
              <UnassignedStudentsPanel pendingEnrollments={pendingEnrollments} />
            </section>

            {workspaces.length === 0 ? (
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
          </>
        )}
      </section>
    </main>
  );
}
