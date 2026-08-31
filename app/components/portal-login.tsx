"use client";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";

import {
  getSupabaseAuthMessage,
  loginWithEmailAndPassword,
  signOutCurrentUser,
} from "../_lib/supabase/auth";
import { hasPortalAccess } from "../_data/portal-access.repository";
import type { PortalCopy, PortalRole } from "../_types/auth";
import { MascotBackground } from "./mascot-background";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

const inputClassName =
  "h-12 w-full rounded-sm border border-stone-200 bg-ivory-light px-11 text-base text-ink shadow-xs outline-none transition placeholder:text-ink-muted focus:border-forest focus:bg-offwhite focus:ring-2 focus:ring-forest/15 sm:text-sm";

const portalCopy: Record<PortalRole, PortalCopy> = {
  student: {
    label: "Student portal",
    title: "Student login",
    text: "Sign in to open your lessons, enrolled courses, and profile.",
    emailLabel: "Student email",
    destination: "/student",
  },
  mentor: {
    label: "Mentor portal",
    title: "Mentor login",
    text: "Sign in to open your assigned groups, schedules, and attendance workspace.",
    emailLabel: "Mentor email",
    destination: "/mentor",
  },
  "super-admin": {
    label: "Super-admin portal",
    title: "Super-admin login",
    text: "Sign in to manage portal access for students and mentors.",
    emailLabel: "Super-admin email",
    destination: "/super-admin",
  },
};

export function PortalLogin({ role }: { role: PortalRole }) {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const copy = portalCopy[role];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      setIsSubmitting(true);
      setError(null);

      const user = await loginWithEmailAndPassword(email, password);
      let roleExists = false;

      try {
        roleExists = await hasPortalAccess(role, user.id);
      } catch (accessError) {
        console.error(accessError);
        await signOutCurrentUser();
        setError(
          "You signed in, but we could not verify portal access. Check Supabase table policies and profile rows.",
        );
        return;
      }

      if (!roleExists) {
        await signOutCurrentUser();
        setError(
          `This account does not have access to the ${copy.label.toLowerCase()}.`,
        );
        return;
      }

      router.push(copy.destination);
    } catch (loginError) {
      console.error(loginError);
      setError(getSupabaseAuthMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory text-ink">
      <MascotBackground className="-bottom-24 -right-52 hidden h-[22rem] w-[44rem] rotate-[-5deg] sm:block" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-64 w-[34rem] bg-contain bg-center bg-no-repeat opacity-15 sm:-right-24 sm:top-10 sm:h-72 sm:w-[36rem] sm:opacity-20"
        style={{ backgroundImage: "url('/offspace-vines.svg')" }}
      />
      <div className="relative mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-xs px-2 text-sm font-bold text-forest transition hover:text-forest-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span>Back home</span>
          </Link>
          <Badge variant="muted" className="shrink-0">
            {copy.label}
          </Badge>
        </header>

        <section className="grid flex-1 content-start gap-6 py-7 sm:py-10 lg:grid-cols-[0.85fr_1.15fr] lg:content-center lg:items-center">
          <div className="max-w-xl">
            
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink text-balance sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink-soft sm:mt-4 sm:text-base sm:leading-7">
              {copy.text}
            </p>
          </div>

          <Card className="w-full overflow-hidden bg-offwhite/95 shadow-lg backdrop-blur">
            <CardHeader className="border-b border-stone-100 p-5 sm:p-6 flex justify-between w-full">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <Badge variant="muted" className="w-fit">
                {copy.label}
              </Badge>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              <form
                onSubmit={handleSubmit}
                aria-describedby={error ? errorId : undefined}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor={emailId}
                    className="text-sm font-semibold text-ink"
                  >
                    {copy.emailLabel}
                  </label>
                  <div className="relative mt-2">
                    <Mail
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      id={emailId}
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      placeholder="name@example.com"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={passwordId}
                    className="text-sm font-semibold text-ink"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <LockKeyhole
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      id={passwordId}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      className={`${inputClassName} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((isVisible) => !isVisible)}
                      className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xs text-ink-muted transition hover:bg-sage-50 hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff aria-hidden="true" className="h-4 w-4" />
                      ) : (
                        <Eye aria-hidden="true" className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error ? (
                  <p
                    id={errorId}
                    role="alert"
                    className="rounded-sm border border-danger/20 bg-danger/10 px-3 py-2 text-sm leading-6 text-danger"
                  >
                    {error}
                  </p>
                ) : null}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Signing in..." : "Continue"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </form>

              {role === "student" ? (
                <Link
                  href="/student/register"
                  className={buttonVariants({
                    variant: "secondary",
                    className: "mt-3 w-full",
                  })}
                >
                  Register as a student
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
