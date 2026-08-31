"use client";

import Link from "next/link";
import { useActionState } from "react";

import { MascotBackground } from "../../components/mascot-background";
import {
  registerStudent,
  type StudentRegistrationState,
} from "./actions";

const initialRegistrationState: StudentRegistrationState = {
  status: "idle",
  message: "",
  canOpenHub: false,
  fields: {
    name: "",
    lastName: "",
    email: "",
    phone: "",
  },
};

export function StudentRegistration() {
  const [state, formAction, isPending] = useActionState(
    registerStudent,
    initialRegistrationState,
  );

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
              Create your student account with email and password. After
              registration, you can choose available courses from your student
              hub.
            </p>
          </div>

          <form
            action={formAction}
            className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-md sm:p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
              Student account
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Create account
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Use the same email and password later on the student login page.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="given-name"
                  defaultValue={state.fields.name}
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
                  defaultValue={state.fields.lastName}
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                defaultValue={state.fields.email}
                className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink">Phone</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                defaultValue={state.fields.phone}
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
                  minLength={8}
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
                  minLength={8}
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>
            </div>

            {state.message ? (
              <p
                aria-live="polite"
                className={`mt-4 rounded-sm border px-3 py-2 text-sm ${
                  state.status === "success"
                    ? "border-success/20 bg-success/10 text-success"
                    : "border-danger/20 bg-danger/10 text-danger"
                }`}
              >
                {state.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="mt-6 w-full rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Creating account..." : "Create student account"}
            </button>

            <Link
              href={state.canOpenHub ? "/student" : "/student/login"}
              className="mt-3 inline-flex w-full justify-center rounded-sm border border-stone-200 bg-offwhite px-4 py-3 text-sm font-bold text-forest transition hover:border-sage-300 hover:bg-ivory-light"
            >
              {state.canOpenHub ? "Open student hub" : "Go to student login"}
            </Link>
          </form>
        </section>
      </div>
    </main>
  );
}
