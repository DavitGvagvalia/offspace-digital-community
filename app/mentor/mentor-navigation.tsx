"use client";

import {
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  Home,
  UsersRound,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../_lib/ui/utils";

const mentorNavItems = [
  {
    href: "/mentor/hub",
    label: "Hub",
    icon: Home,
  },
  {
    href: "/mentor/lessons",
    label: "Lessons",
    icon: CalendarDays,
  },
  {
    href: "/mentor/groups",
    label: "Groups",
    icon: UsersRound,
  },
  {
    href: "/mentor/profile",
    label: "Profile",
    icon: UserRound,
  },
];

export function MentorNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mentor navigation"
      className="rounded-md border border-stone-200 bg-offwhite/90 p-1.5 shadow-sm backdrop-blur"
    >
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mentorNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex min-h-14 min-w-20 flex-1 flex-col items-center justify-center gap-1 rounded-sm px-3 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:min-h-11 sm:min-w-0 sm:flex-row sm:gap-2 sm:text-sm",
                isActive
                  ? "bg-forest text-ivory shadow-sm"
                  : "text-ink-soft hover:bg-sage-50 hover:text-forest",
              )}
            >
              <Icon
                aria-hidden="true"
                className="h-5 w-5 shrink-0 sm:h-4 sm:w-4"
              />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MentorPageTitle({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <header className="flex items-start gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-sage-50 text-forest ring-1 ring-sage-200"
        aria-hidden="true"
      >
        <GraduationCap className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">
          Mentor portal
        </p>
        <h1 className="mt-2 break-words text-3xl font-semibold text-ink">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
      </div>
    </header>
  );
}
