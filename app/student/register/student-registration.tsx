"use client";

import Link from "next/link";

import { MascotBackground } from "../../components/mascot-background";

export function StudentRegistration() {
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
              Student accounts are created by a super-admin. Contact Offspace
              Digital Community if you need access.
            </p>
          </div>

          <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-md sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
              Account access
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Registration is managed
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              This portal no longer supports public self-registration. A
              super-admin creates student accounts in Supabase.
            </p>
            <Link
              href="/student/login"
              className="mt-6 inline-flex w-full justify-center rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light"
            >
              Go to student login
            </Link>
          </section>
        </section>
      </div>
    </main>
  );
}
