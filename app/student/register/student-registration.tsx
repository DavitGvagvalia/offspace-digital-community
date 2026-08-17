"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { registerStudentAccount } from "../../services/auth.services";
import { MascotBackground } from "../../components/mascot-background";

export function StudentRegistration() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await registerStudentAccount({
        name,
        lastName,
        email,
        password,
        ...(phone ? { phone } : {}),
      });

      router.push("/student");
    } catch (registrationError) {
      setError(getRegistrationMessage(registrationError));
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
          <p className="text-sm font-semibold text-ink-soft">Student portal</p>
        </header>

        <section className="grid flex-1 items-center gap-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">
              Offspace Digital Community
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">
              Student registration
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
              Create a student account with email and password.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-md sm:p-6"
          >
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                Student portal
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                Create account
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="given-name"
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Last name</span>
                <input
                  type="text"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink">
                Student email
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
              <span className="text-sm font-semibold text-ink">Phone</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Password</span>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">
                  Confirm password
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>
            </div>

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
              {isSubmitting ? "Creating account..." : "Create student account"}
            </button>

            <p className="mt-4 text-center text-sm text-ink-soft">
              Already registered?{" "}
              <Link
                href="/student/login"
                className="font-semibold text-forest hover:text-forest-light"
              >
                Sign in
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

function getRegistrationMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    if (error.code === "auth/email-already-in-use") {
      return "An account with this email already exists.";
    }

    if (error.code === "auth/weak-password") {
      return "Use a stronger password.";
    }

    if (error.code === "auth/invalid-email") {
      return "Enter a valid email address.";
    }

    if (error.code === "auth/operation-not-allowed") {
      return "Email and password registration is not enabled for this Firebase project.";
    }
  }

  return "We could not create your student account right now. Please try again.";
}
