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
    href: "/student",
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
      className="rounded-md border border-stone-200 bg-offwhite p-2 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {studentNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/student" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm px-2 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:gap-2 sm:px-3",
                isActive
                  ? "bg-forest text-ivory shadow-sm"
                  : "text-ink-soft hover:bg-sage-50 hover:text-forest",
              )}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
