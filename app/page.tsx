import Link from "next/link";

import { MascotBackground } from "./components/mascot-background";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory text-ink">
      <MascotBackground className="-right-40 bottom-20 h-[26rem] w-[52rem] rotate-[-4deg] opacity-[0.1]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-8 h-72 w-[36rem] bg-contain bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/offspace-vines.svg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -left-28 h-72 w-[36rem] rotate-180 bg-contain bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: "url('/offspace-vines.svg')" }}
      />
      <section className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">
          Offspace Digital Community
        </p>
        <h1 className="mt-3 text-5xl font-semibold text-ink sm:text-6xl">
          Offspace schedule access
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft">
          Open your schedule and attendance workspace.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/student/login"
            className="rounded-sm bg-forest px-5 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light"
          >
            Student login
          </Link>
          <Link
            href="/mentor/login"
            className="rounded-sm border border-stone-200 bg-offwhite px-5 py-3 text-sm font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink"
          >
            Mentor login
          </Link>
          <Link
            href="/student/register"
            className="rounded-sm border border-stone-200 bg-offwhite px-5 py-3 text-sm font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink"
          >
            Student registration
          </Link>
          <Link
            href="/super-admin/login"
            className="rounded-sm border border-stone-200 bg-offwhite px-5 py-3 text-sm font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink"
          >
            Super-admin login
          </Link>
        </div>
      </section>
    </main>
  );
}
