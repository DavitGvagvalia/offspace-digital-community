import type { ReactNode } from "react";

import { copy } from "../lib/copy";
import type { Language } from "../lib/demo-data";
import { LanguageSwitcher } from "./language-switcher";

export function AppFrame({
  language,
  onLanguageChange,
  eyebrow,
  title,
  children,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const t = copy[language];

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-stone-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">
              {t.appName}
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">{eyebrow}</p>
          </div>
          <LanguageSwitcher language={language} onChange={onLanguageChange} />
        </header>

        <p className="mt-4 rounded-sm border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-ink-soft">
          {t.demoNotice}
        </p>

        {children}
      </div>
    </main>
  );
}

export function WorkspaceShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-md border border-stone-200 bg-offwhite p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {children}
      </div>
    </div>
  );
}
