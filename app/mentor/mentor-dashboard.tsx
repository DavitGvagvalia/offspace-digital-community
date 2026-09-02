"use client";

import { useMemo, useState } from "react";

import { AccessError, LoadingState } from "../components/auth-states";
import { StatePanel } from "../components/state-panel";
import { useRequiredProfile } from "../components/use-required-profile";
import { useSessionCachedQuery } from "../_lib/session-cache";
import { addAttendance, deleteAttendance } from "./_data/attendance";
import { createLessonWithDetails, updateLessonDetails } from "./_data/lessons";
import { getMentorGroupWorkspaces } from "./_data/workspace";
import type { MentorGroupWorkspace } from "./_types/workspace";
import {
  GroupWorkspace,
  MentorGroupList,
  type AttendanceToggleRequest,
  type LessonCreateRequest,
  type LessonUpdateRequest,
} from "./mentor-workspace-components";

const emptyWorkspaces: MentorGroupWorkspace[] = [];

export function MentorDashboard() {
  const { user, profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("mentor");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingAttendanceIds, setPendingAttendanceIds] = useState<string[]>([]);
  const [pendingLessonIds, setPendingLessonIds] = useState<string[]>([]);
  const [pendingLessonCreateGroupIds, setPendingLessonCreateGroupIds] = useState<
    string[]
  >([]);
  const workspacesQuery = useSessionCachedQuery<MentorGroupWorkspace[]>({
    key: user ? `mentor:${user.id}:group-workspaces` : null,
    enabled: Boolean(user),
    fetcher: () => {
      if (!user) {
        return Promise.resolve([]);
      }

      return getMentorGroupWorkspaces(user.id);
    },
  });
  const workspaces = workspacesQuery.data ?? emptyWorkspaces;
  const activeSelectedGroupId = workspaces.some(
    (workspace) => workspace.group.id === selectedGroupId,
  )
    ? selectedGroupId
    : workspaces[0]?.group.id ?? "";

  const selectedWorkspace = useMemo(() => {
    return workspaces.find(
      (workspace) => workspace.group.id === activeSelectedGroupId,
    );
  }, [activeSelectedGroupId, workspaces]);

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

        workspacesQuery.setLocalData((currentWorkspaces) =>
          (currentWorkspaces ?? []).map((currentWorkspace) => {
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

        workspacesQuery.setLocalData((currentWorkspaces) =>
          (currentWorkspaces ?? []).map((currentWorkspace) => {
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

  async function handleUpdateLesson(request: LessonUpdateRequest) {
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

    const lesson = workspace.lessons.find(
      (currentLesson) => currentLesson.id === request.lessonId,
    );

    if (!lesson) {
      setActionError("Lesson details can only be changed for this group's lessons.");
      return;
    }

    if (pendingLessonIds.includes(request.lessonId)) {
      return;
    }

    try {
      setActionError(null);
      setPendingLessonIds((currentIds) => [...currentIds, request.lessonId]);

      const updatedLesson = await updateLessonDetails({
        courseId: workspace.group.courseId,
        groupId: workspace.group.id,
        lessonId: request.lessonId,
        title: request.title,
        description: request.description,
      });

      workspacesQuery.setLocalData((currentWorkspaces) =>
        (currentWorkspaces ?? []).map((currentWorkspace) => {
          if (currentWorkspace.group.id !== workspace.group.id) {
            return currentWorkspace;
          }

          return {
            ...currentWorkspace,
            lessons: currentWorkspace.lessons.map((currentLesson) =>
              currentLesson.id === updatedLesson.id ? updatedLesson : currentLesson,
            ),
          };
        }),
      );
    } catch (updateError) {
      console.error(updateError);
      setActionError("We could not update this lesson. Check your connection and try again.");
      throw updateError;
    } finally {
      setPendingLessonIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== request.lessonId),
      );
    }
  }

  async function handleCreateLesson(request: LessonCreateRequest) {
    if (!user) {
      return;
    }

    const workspace = workspaces.find(
      (currentWorkspace) => currentWorkspace.group.id === request.groupId,
    );

    if (!workspace || workspace.group.mentorId !== user.id) {
      setActionError("This group is not available for your mentor account.");
      throw new Error("Unavailable mentor group");
    }

    if (workspace.students.length === 0) {
      setActionError("Lessons can be created after students are assigned to this group.");
      throw new Error("No assigned students");
    }

    const assignedStudentIds = new Set(
      workspace.students.map((student) => student.id),
    );
    const attendedStudentIds = request.attendedStudentIds.filter((studentId) =>
      assignedStudentIds.has(studentId),
    );

    if (pendingLessonCreateGroupIds.includes(request.groupId)) {
      return;
    }

    try {
      setActionError(null);
      setPendingLessonCreateGroupIds((currentIds) => [
        ...currentIds,
        request.groupId,
      ]);

      const createdLesson = await createLessonWithDetails({
        courseId: workspace.group.courseId,
        groupId: workspace.group.id,
        title: request.title,
        description: request.description,
        date: request.date,
      });
      const attendanceResults = await Promise.allSettled(
        attendedStudentIds.map((studentId) =>
          addAttendance({
            studentId,
            courseId: workspace.group.courseId,
            groupId: workspace.group.id,
            lessonId: createdLesson.id,
          }),
        ),
      );
      const createdAttendances = attendanceResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      const failedAttendanceCount =
        attendanceResults.length - createdAttendances.length;

      workspacesQuery.setLocalData((currentWorkspaces) =>
        (currentWorkspaces ?? []).map((currentWorkspace) => {
          if (currentWorkspace.group.id !== workspace.group.id) {
            return currentWorkspace;
          }

          return {
            ...currentWorkspace,
            lessons: sortLessonsByDate([
              ...currentWorkspace.lessons.filter(
                (lesson) => lesson.id !== createdLesson.id,
              ),
              createdLesson,
            ]),
            attendances: [
              ...currentWorkspace.attendances.filter(
                (attendance) =>
                  !createdAttendances.some(
                    (createdAttendance) => createdAttendance.id === attendance.id,
                  ),
              ),
              ...createdAttendances,
            ],
          };
        }),
      );

      if (failedAttendanceCount > 0) {
        setActionError(
          `Lesson was created, but ${failedAttendanceCount} attendance ${
            failedAttendanceCount === 1 ? "record" : "records"
          } could not be saved. Use the attendance toggles to fix it.`,
        );
      }
    } catch (createError) {
      console.error(createError);
      setActionError("We could not create this lesson. Check your connection and try again.");
      throw createError;
    } finally {
      setPendingLessonCreateGroupIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== request.groupId),
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

        {workspacesQuery.isLoading ? (
          <StatePanel title="Loading groups" text="Checking your assigned groups." />
        ) : workspacesQuery.error ? (
          <StatePanel title="Workspace unavailable" text="We could not load your mentor workspace right now." />
        ) : workspaces.length === 0 ? (
          <StatePanel title="No assigned groups" text="No groups were found for this mentor account yet." />
        ) : (
          <section className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <MentorGroupList
              workspaces={workspaces}
              selectedGroupId={activeSelectedGroupId}
              onSelectGroup={setSelectedGroupId}
            />

            {selectedWorkspace ? (
              <GroupWorkspace
                workspace={selectedWorkspace}
                actionError={actionError}
                pendingAttendanceIds={pendingAttendanceIds}
                pendingLessonIds={pendingLessonIds}
                pendingLessonCreateGroupIds={pendingLessonCreateGroupIds}
                onCreateLesson={handleCreateLesson}
                onToggleAttendance={handleToggleAttendance}
                onUpdateLesson={handleUpdateLesson}
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

function sortLessonsByDate(lessons: MentorGroupWorkspace["lessons"]) {
  return [...lessons].sort((firstLesson, secondLesson) => {
    return (
      new Date(firstLesson.date).getTime() - new Date(secondLesson.date).getTime()
    );
  });
}
