"use client";

import { PortalLogoutButton } from "./portal-logout-button";
import type { PortalRole } from "../_types/auth";

export function PortalHeader({
  role,
  eyebrow,
  title,
  text,
}: {
  role: PortalRole;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <header className="sticky top-3 z-30 flex flex-col gap-4 rounded-md border border-stone-200 bg-offwhite/95 p-5 shadow-md backdrop-blur sm:flex-row sm:items-start sm:justify-between">
  
      <div className="min-w-0">
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
          {eyebrow}
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
          {text}
        </p>
      </div>
      
    </header>
  );
}
