"use client";

import { AccessError, LoadingState } from "../../components/auth-states";
import { StatePanel } from "../../components/state-panel";
import { useRequiredProfile } from "../../components/use-required-profile";
import { useSessionCachedQuery } from "../../_lib/session-cache";
import { MentorNavigation, MentorPageTitle } from "../mentor-navigation";
import { getMentorHubState, type MentorHubState } from "../_data/hub";
import { UngroupedStudentsSection } from "./ungrouped-students-section";
import { UpcomingLessonsSection } from "./upcoming-lessons-section";

export function MentorHubView() {
  const { user, profile, isLoading: isAuthLoading, error: authError } =
    useRequiredProfile("mentor");
  const hubQuery = useSessionCachedQuery<MentorHubState>({
    key: user ? `mentor:${user.id}:hub-state` : null,
    enabled: Boolean(user),
    fetcher: () => {
      if (!user) {
        return Promise.resolve({
          upcomingLessons: [],
          ungroupedStudents: [],
        });
      }

      return getMentorHubState(user.id);
    },
  });

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
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <MentorNavigation />
        <MentorPageTitle
          title="Hub"
          text="Review what is coming next and keep student group assignment moving."
        />

        {hubQuery.isLoading ? (
          <StatePanel
            title="Loading mentor hub"
            text="Checking your upcoming lessons and ungrouped students."
          />
        ) : hubQuery.error ? (
          <StatePanel
            title="Hub unavailable"
            text="We could not load your mentor hub right now."
          />
        ) : (
          <>
            <UpcomingLessonsSection
              lessons={hubQuery.data?.upcomingLessons ?? []}
            />
            <UngroupedStudentsSection
              students={hubQuery.data?.ungroupedStudents ?? []}
            />
          </>
        )}
      </section>
    </main>
  );
}
