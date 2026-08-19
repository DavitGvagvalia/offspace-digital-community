"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  getFirebaseLoginMessage,
  loginWithEmailAndPassword,
  signOutCurrentUser,
} from "../_lib/firebase/auth";
import { hasPortalAccess } from "../_data/portal-access.repository";
import type { PortalCopy, PortalRole } from "../_types/auth";
import { MascotBackground } from "./mascot-background";

const portalCopy: Record<PortalRole, PortalCopy> = {
  student: {
    label: "Student portal",
    title: "Student login",
    text: "Sign in to open your lessons, enrolled courses, and profile.",
    emailLabel: "Student email",
    destination: "/student",
  },
  mentor: {
    label: "Mentor portal",
    title: "Mentor login",
    text: "Sign in to open your assigned groups, schedules, and attendance workspace.",
    emailLabel: "Mentor email",
    destination: "/mentor",
  },
  "super-admin": {
    label: "Super-admin portal",
    title: "Super-admin login",
    text: "Sign in to manage portal access for students and mentors.",
    emailLabel: "Super-admin email",
    destination: "/super-admin",
  },
};

export function PortalLogin({ role }: { role: PortalRole }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = portalCopy[role];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      setIsSubmitting(true);
      setError(null);

      const user = await loginWithEmailAndPassword(email, password);
      const roleExists = await hasPortalAccess(role, user.uid);

      if (!roleExists) {
        await signOutCurrentUser();
        setError(`This account does not have access to the ${copy.label.toLowerCase()}.`);
        return;
      }

      router.push(copy.destination);
    } catch (loginError) {
      setError(getFirebaseLoginMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory text-ink">
      <MascotBackground className="-bottom-20 -right-44 h-[22rem] w-[44rem] rotate-[-5deg]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-[36rem] bg-contain bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/offspace-vines.svg')" }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold text-forest hover:text-forest-light">
            Back home
          </Link>
          <p className="text-sm font-semibold text-ink-soft">{copy.label}</p>
        </header>

        <section className="grid flex-1 items-center gap-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">
              Offspace Digital Community
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
              {copy.text}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-md sm:p-6"
          >
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                {copy.label}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                Sign in
              </h2>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-ink">
                {copy.emailLabel}
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink">Password</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </label>

            {error ? (
              <p className="mt-4 rounded-sm border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>

            {role === "student" ? (
              <p className="mt-4 text-center text-sm text-ink-soft">
                New student?{" "}
                <Link
                  href="/student/register"
                  className="font-semibold text-forest hover:text-forest-light"
                >
                  Create an account
                </Link>
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
