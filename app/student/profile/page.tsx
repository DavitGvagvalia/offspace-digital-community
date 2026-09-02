"use client";

import { AccessError, LoadingState } from "../../components/auth-states";
import { useRequiredProfile } from "../../components/use-required-profile";
import { StudentNavigation } from "../student-navigation";
import { StudentProfileActions } from "./student-profile-actions";

export default function StudentProfilePage() {
  const { user, profile, isLoading, error } = useRequiredProfile("student");

  if (isLoading) {
    return <LoadingState title="Loading profile" />;
  }

  if (error || !user || !profile) {
    return (
      <AccessError
        message={error ?? "We could not load your student profile."}
        loginHref="/student/login"
      />
    );
  }

  const rows = [
    ["Name", profile.name],
    ["Last name", profile.lastName],
    ["Email", profile.email ?? "Not added"],
    ["Phone", profile.phone ?? "Not added"],
  ];

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <StudentNavigation />

        <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="rounded-sm border border-stone-200 bg-ivory-light p-4"
              >
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                  {label}
                </dt>
                <dd className="mt-2 text-lg font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <StudentProfileActions />
      </section>
    </main>
  );
}
