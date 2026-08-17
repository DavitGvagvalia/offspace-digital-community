"use client";

import Link from "next/link";

import { AccessError, LoadingState } from "../components/auth-states";
import { useRequiredProfile } from "../components/use-required-profile";

const navItems = [
  {
    href: "/student/lessons",
    title: "Lessons",
    text: "Review scheduled lessons and your attendance status.",
  },
  {
    href: "/student/courses",
    title: "Courses",
    text: "See your active course enrollments and group details.",
  },
  {
    href: "/student/profile",
    title: "Profile",
    text: "View the basic student information connected to your account.",
  },
];

export default function StudentPage() {
  const { profile, isLoading, error } = useRequiredProfile("student");

  if (isLoading) {
    return <LoadingState title="Loading student hub" />;
  }

  if (error || !profile) {
    return (
      <AccessError
        message={error ?? "We could not load your student profile."}
        loginHref="/student/login"
      />
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
            Student hub
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            {profile.name} {profile.lastName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Open your lessons, enrolled courses, or profile.
          </p>
        </header>

        <nav className="grid gap-3 md:grid-cols-3" aria-label="Student navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm transition hover:border-sage-300 hover:shadow-md"
            >
              <span className="text-xl font-semibold text-ink">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-ink-soft">
                {item.text}
              </span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
