"use client";

import { AccessError, LoadingState } from "../../components/auth-states";
import { useRequiredProfile } from "../../components/use-required-profile";
import { MentorNavigation, MentorPageTitle } from "../mentor-navigation";
import { ProfileActionsSection } from "./profile-actions-section";
import { ProfileDetailsSection } from "./profile-details-section";

export default function MentorProfilePage() {
  const { user, profile, isLoading, error } = useRequiredProfile("mentor");

  if (isLoading) {
    return <LoadingState title="Loading profile" />;
  }

  if (error || !user || !profile) {
    return (
      <AccessError
        message={error ?? "We could not load your mentor profile."}
        loginHref="/mentor/login"
      />
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <MentorNavigation />
        <MentorPageTitle
          title="Profile"
          text="Review the mentor profile connected to this portal account."
        />

        <ProfileDetailsSection profile={profile} />
        <ProfileActionsSection />
      </section>
    </main>
  );
}
