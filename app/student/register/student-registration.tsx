"use client";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import {
  type MouseEvent,
  type ReactNode,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/app/_lib/ui/utils";
import { Badge } from "../../components/ui/badge";
import { Button, buttonVariants } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { MascotBackground } from "../../components/mascot-background";
import {
  registerStudent,
<<<<<<< HEAD
  type RegistrationActionState,
} from "./actions";

const initialRegistrationState: RegistrationActionState = {
  status: "idle",
  message: null,
=======
  type StudentRegistrationState,
} from "./actions";

type RegistrationFields = StudentRegistrationState["fields"];
type RegistrationStep = "details" | "password";

const inputClassName =
  "h-12 w-full rounded-sm border border-stone-200 bg-ivory-light px-11 text-base text-ink shadow-xs outline-none transition placeholder:text-ink-muted focus:border-forest focus:bg-offwhite focus:ring-2 focus:ring-forest/15 sm:text-sm";

const initialRegistrationState: StudentRegistrationState = {
  status: "idle",
  message: "",
  canOpenHub: false,
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
  fields: {
    name: "",
    lastName: "",
    email: "",
    phone: "",
  },
};

export function StudentRegistration() {
  const [state, formAction, isPending] = useActionState(
    registerStudent,
    initialRegistrationState,
  );
  const [step, setStep] = useState<RegistrationStep>("details");
  const [fields, setFields] = useState<RegistrationFields>(
    initialRegistrationState.fields,
  );
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "password") {
      passwordInputRef.current?.focus();
    }
  }, [step]);

<<<<<<< HEAD
        <section className="grid flex-1 items-center gap-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">
              Offspace Digital Community
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">
              Student registration
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
<<<<<<< HEAD
              Create your student account, then choose available courses from
              the student hub after signing in.
=======
              Create your student account with email and password. After
              registration, you can choose available courses from your student
              hub.
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
            </p>
          </div>

          <form
            action={formAction}
            className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-md sm:p-6"
          >
<<<<<<< HEAD
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                Student portal
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                Create account
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
=======
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
              Student account
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Create account
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Use the same email and password later on the student login page.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
              <label className="block">
                <span className="text-sm font-semibold text-ink">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="given-name"
                  defaultValue={state.fields.name}
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>

              <label className="block">
<<<<<<< HEAD
                <span className="text-sm font-semibold text-ink">
                  Last name
                </span>
=======
                <span className="text-sm font-semibold text-ink">Last name</span>
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
                <input
                  type="text"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  defaultValue={state.fields.lastName}
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                defaultValue={state.fields.email}
                className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink">Phone</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                defaultValue={state.fields.phone}
                className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
<<<<<<< HEAD
                <span className="text-sm font-semibold text-ink">
                  Password
                </span>
=======
                <span className="text-sm font-semibold text-ink">Password</span>
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">
                  Confirm password
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-sm border border-stone-200 bg-ivory-light px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </label>
            </div>

            {state.message ? (
              <p
<<<<<<< HEAD
=======
                aria-live="polite"
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
                className={`mt-4 rounded-sm border px-3 py-2 text-sm ${
                  state.status === "success"
                    ? "border-success/20 bg-success/10 text-success"
                    : "border-danger/20 bg-danger/10 text-danger"
                }`}
              >
                {state.message}
              </p>
            ) : null}

            <button
              type="submit"
<<<<<<< HEAD
              disabled={isPending || state.status === "success"}
=======
              disabled={isPending}
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
              className="mt-6 w-full rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Creating account..." : "Create student account"}
            </button>

<<<<<<< HEAD
            <p className="mt-4 text-center text-sm text-ink-soft">
              Already registered?{" "}
              <Link
                href="/student/login"
                className="font-semibold text-forest hover:text-forest-light"
              >
                Go to student login
              </Link>
            </p>
=======
=======
  function updateField(field: keyof RegistrationFields, value: string) {
    setFields((currentFields) => ({
      ...currentFields,
      [field]: value,
    }));
  }

  function continueToPasswordStep(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;

    if (!form?.reportValidity()) {
      return;
    }

    setStep("password");
  }

  const stepNumber = step === "details" ? 1 : 2;

  if (state.status === "success") {
    return (
      <RegistrationShell>
        <RegistrationIntro />
        <Card className="w-full overflow-hidden bg-offwhite/95 shadow-lg backdrop-blur">
          <CardHeader className="border-b border-stone-100 p-5 sm:p-6">
            <Badge variant="muted" className="w-fit">
              Student account
            </Badge>
            <CardTitle className="text-2xl">Account created</CardTitle>
            <CardDescription>{state.message}</CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
>>>>>>> 350f812 (feat: enhance student registration and navigation experience)
            <Link
              href={state.canOpenHub ? "/student" : "/student/login"}
              className={buttonVariants({ className: "w-full" })}
            >
              {state.canOpenHub ? "Open student hub" : "I have an account"}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </RegistrationShell>
    );
  }

  return (
    <RegistrationShell>
      <RegistrationIntro />

      <Card className="w-full overflow-hidden bg-offwhite/95 shadow-lg backdrop-blur">
        <CardHeader className="border-b border-stone-100 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <CardTitle >
              Student Registration
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <form
            action={formAction}
            className="space-y-5"
          >


            {step === "details" ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-ink">Name</span>
                    <div className="relative mt-2">
                      <User
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                      />
                      <input
                        type="text"
                        name="name"
                        required
                        autoComplete="given-name"
                        value={fields.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        className={inputClassName}
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-ink">
                      Last name
                    </span>
                    <div className="relative mt-2">
                      <User
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                      />
                      <input
                        type="text"
                        name="lastName"
                        required
                        autoComplete="family-name"
                        value={fields.lastName}
                        onChange={(event) =>
                          updateField("lastName", event.target.value)
                        }
                        className={inputClassName}
                      />
                    </div>
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">Email</span>
                  <div className="relative mt-2">
                    <Mail
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={fields.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="name@example.com"
                      className={inputClassName}
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">
                    Phone <span className="text-ink-muted">(optional)</span>
                  </span>
                  <div className="relative mt-2">
                    <Phone
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+995"
                      value={fields.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      className={inputClassName}
                    />
                  </div>
                </label>

                {state.message ? <RegistrationMessage state={state} /> : null}

                <Button
                  type="button"
                  onClick={continueToPasswordStep}
                  className="w-full"
                >
                  Continue
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <input type="hidden" name="name" value={fields.name} />
                <input type="hidden" name="lastName" value={fields.lastName} />
                <input type="hidden" name="email" value={fields.email} />
                <input type="hidden" name="phone" value={fields.phone} />

                <div className="rounded-sm border border-stone-100 bg-ivory-light px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                    Account email
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-ink">
                    {fields.email}
                  </p>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">
                    Password
                  </span>
                  <div className="relative mt-2">
                    <LockKeyhole
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
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
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-ink">
                    Confirm password
                  </span>
                  <div className="relative mt-2">
                    <LockKeyhole
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className={inputClassName}
                    />
                  </div>
                </label>

                {state.message ? <RegistrationMessage state={state} /> : null}

                <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep("details")}
                    disabled={isPending}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating account..." : "Create account"}
                    <UserPlus aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            <Link
              href="/student/login"
              className={buttonVariants({
                variant: "quiet",
                className: "w-full",
              })}
            >
              I have an account
            </Link>
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
          </form>
        </CardContent>
      </Card>
    </RegistrationShell>
  );
}

function RegistrationShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-ivory text-ink">
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
            Student portal
          </Badge>
        </header>

        <section className="grid flex-1 content-start gap-6 py-7 sm:py-10 lg:grid-cols-[0.85fr_1.15fr] lg:content-center lg:items-center">
          {children}
        </section>
      </div>
    </main>
  );
}

function RegistrationIntro() {
  return (
    <div className="max-w-xl">
      <CardTitle className="text-2xl">
        Let us get you started.
      </CardTitle>

    </div>
  );
}

function RegistrationMessage({
  state,
}: {
  state: StudentRegistrationState;
}) {
  return (
    <p
      aria-live="polite"
      className={cn(
        "rounded-sm border px-3 py-2 text-sm leading-6",
        state.status === "success"
          ? "border-success/20 bg-success/10 text-success"
          : "border-danger/20 bg-danger/10 text-danger",
      )}
    >
      {state.message}
    </p>
  );
}
