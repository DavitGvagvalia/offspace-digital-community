import { toMillis } from "../../_lib/dates";
import type { Course } from "../../_types/course";
import type { Group } from "../../_types/group";
import type { Lesson } from "../../_types/lesson";
import type { MentorEnrollmentStudent } from "../_types/workspace";
import { getUngroupedMentorEnrollmentStudents } from "./courses";
import { getMentorGroupWorkspaces } from "./workspace";

export type MentorHubLesson = {
  lesson: Lesson;
  group: Group;
  course: Course | null;
};

export type MentorHubState = {
  upcomingLessons: MentorHubLesson[];
  ungroupedStudents: MentorEnrollmentStudent[];
};

export async function getMentorHubState(
  mentorId: string,
): Promise<MentorHubState> {
  const [workspaces, ungroupedStudents] = await Promise.all([
    getMentorGroupWorkspaces(mentorId),
    getUngroupedMentorEnrollmentStudents(mentorId),
  ]);
  const now = Date.now();
  const upcomingLessons = workspaces
    .flatMap((workspace) =>
      workspace.lessons.map((lesson) => ({
        lesson,
        group: workspace.group,
        course: workspace.course,
      })),
    )
    .filter((item) => toMillis(item.lesson.date) > now)
    .sort(
      (first, second) =>
        toMillis(first.lesson.date) - toMillis(second.lesson.date),
    );

  return {
    upcomingLessons,
    ungroupedStudents,
  };
}
