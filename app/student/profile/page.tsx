"use client";

import Link from "next/link";

import { AccessError, LoadingState } from "../../components/auth-states";
import { useRequiredProfile } from "../../components/use-required-profile";

export default function StudentProfilePage() {
  const { profile, isLoading, error } = useRequiredProfile("student");

  if (isLoading) {
    return <LoadingState title="Loading profile" />;
  }

  if (error || !profile) {
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
        <header className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <Link href="/student" className="text-sm font-semibold text-forest hover:text-forest-light">
            Student hub
          </Link>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
            Student profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            {profile.name} {profile.lastName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            This is the read-only profile connected to your student account.
          </p>
        </header>

        <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-sm border border-stone-200 bg-ivory-light p-4">
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                  {label}
                </dt>
                <dd className="mt-2 text-lg font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>
    </main>
  );
}
