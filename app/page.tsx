import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-ivory text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
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
            href="/teacher/login"
            className="rounded-sm border border-stone-200 bg-offwhite px-5 py-3 text-sm font-bold text-ink-soft transition hover:border-sage-300 hover:text-ink"
          >
            Teacher login
          </Link>
        </div>
      </section>
    </main>
  );
}
