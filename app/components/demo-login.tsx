"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { copy } from "../lib/copy";
import type { Language } from "../lib/demo-data";
import { LanguageSwitcher } from "./language-switcher";
import { MascotBackground } from "./mascot-background";

export function DemoLogin({
  mode,
}: {
  mode: "student" | "teacher";
}) {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language];
  const isTeacher = mode === "teacher";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(isTeacher ? "/teacher" : "/student");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory text-ink">
      <MascotBackground
        className={
          isTeacher
            ? "-bottom-20 -left-44 h-[22rem] w-[44rem] rotate-6"
            : "-bottom-20 -right-44 h-[22rem] w-[44rem] rotate-[-5deg]"
        }
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute h-72 w-[36rem] bg-contain bg-center bg-no-repeat opacity-20 ${
          isTeacher ? "-bottom-8 -right-28 rotate-180" : "-right-24 top-10"
        }`}
        style={{ backgroundImage: "url('/offspace-vines.svg')" }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold text-forest hover:text-forest-light">
            {t.backHome}
          </Link>
          <LanguageSwitcher language={language} onChange={setLanguage} />
        </header>

        <section className="grid flex-1 items-center gap-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">
              {t.appName}
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">
              {isTeacher ? t.teacherLoginTitle : t.studentLoginTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
              {isTeacher ? t.teacherLoginText : t.studentLoginText}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`rounded-md border bg-offwhite p-5 shadow-md sm:p-6 ${
              isTeacher ? "border-forest/30" : "border-stone-200"
            }`}
          >
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                {isTeacher ? t.teacher : t.student}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                {isTeacher ? t.teacherDashboard : t.studentDashboard}
              </h2>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-ink">
                {isTeacher ? t.teacherEmail : t.studentEmail}
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
              <span className="text-sm font-semibold text-ink">{t.password}</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light"
            >
              {t.continue}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
