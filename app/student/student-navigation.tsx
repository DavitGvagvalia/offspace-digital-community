"use client";

import {
  BookOpenCheck,
  CalendarDays,
  Home,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../_lib/ui/utils";

const studentNavItems = [
  {
    href: "/student/hub",
    label: "Hub",
    icon: Home,
  },
  {
    href: "/student/lessons",
    label: "Lessons",
    icon: CalendarDays,
  },
  {
    href: "/student/courses",
    label: "Courses",
    icon: BookOpenCheck,
  },
  {
    href: "/student/profile",
    label: "Profile",
    icon: UserRound,
  },
];

export function StudentNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Student navigation"
      className="rounded-md border border-stone-200 bg-offwhite/90 p-1.5 shadow-sm backdrop-blur"
    >
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {studentNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);
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
