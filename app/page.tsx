import {
  ArrowRight,
  BookOpenCheck,
  CircleCheck,
  Compass,
  LogIn,
  Menu,
  Sparkles,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";

import { MascotBackground } from "./components/mascot-background";
import { Badge } from "./components/ui/badge";
import { buttonVariants } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

const aboutCards = [
  {
    icon: Compass,
    title: "Guided learning",
    text: "A clear environment for students to follow their course path and understand what comes next.",
  },
  {
    icon: UsersRound,
    title: "Connected community",
    text: "A shared digital space where students stay close to the work, the people, and the process.",
  },
  {
    icon: BookOpenCheck,
    title: "Practical growth",
    text: "Built around real progress, simple routines, and the everyday details that support creative-tech learning.",
  },
];

const communityPoints = [
  "Student platform access",
  "Course information in one place",
  "Community-first learning culture",
];

const navigationItems = [
  {
    href: "#about",
    label: "About us",
  },
  {
    href: "/courses",
    label: "View courses",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory text-ink">
      <MascotBackground className="-right-36 top-40 h-[30rem] w-[58rem] rotate-[-5deg] opacity-[0.06] rotate-y-180" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-0 h-72 w-[38rem] bg-contain bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/offspace-vines.svg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 -left-32 h-80 w-[40rem] rotate-180 bg-contain bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: "url('/offspace-vines.svg')" }}
      />

      <HomeNavigation />
      <HeroSection />
      <AboutSection />
      <CommunitySection />
    </main>
  );
}

function HomeNavigation() {
  return (
    <header className="relative z-10 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex w-full max-w-7xl items-center justify-between rounded-md border border-stone-200 bg-offwhite/85 p-3 shadow-sm backdrop-blur"
      >
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-3 rounded-xs px-2 text-forest transition hover:text-forest-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xs bg-forest text-sm font-bold text-ivory">
            O
          </span>
          <span className="truncate text-sm font-bold">
            Offspace Digital Community
          </span>
        </Link>

        <details className="group sm:hidden">
          <summary className="flex h-11 w-11 list-none items-center justify-center rounded-sm border border-stone-200 bg-ivory-light text-forest shadow-sm transition hover:border-sage-300 hover:bg-sage-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest [&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="h-5 w-5 group-open:hidden" />
            <X aria-hidden="true" className="hidden h-5 w-5 group-open:block" />
            <span className="sr-only">Open navigation</span>
          </summary>

          <div className="absolute left-3 right-3 top-[calc(100%+0.5rem)] rounded-md border border-stone-200 bg-offwhite p-3 shadow-lg">
            <div className="grid gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-11 rounded-xs px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-sage-50 hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 grid gap-2 border-t border-stone-100 pt-3">
              <Link
                href="/student/login"
                className={buttonVariants({
                  variant: "quiet",
                  size: "sm",
                  className: "justify-start",
                })}
              >
                <LogIn aria-hidden="true" className="h-4 w-4" />
                Log in
              </Link>
              <Link
                href="/student/register"
                className={buttonVariants({
                  size: "sm",
                  className: "justify-start",
                })}
              >
                <UserPlus aria-hidden="true" className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        </details>

        <div className="hidden sm:flex sm:items-center sm:gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-10 rounded-xs px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-sage-50 hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/student/login"
              className={buttonVariants({
                variant: "quiet",
                size: "sm",
                className: "group",
              })}
            >
              <LogIn aria-hidden="true" className="h-4 w-4" />
              Log in
            </Link>
            <Link
              href="/student/register"
              className={buttonVariants({
                size: "sm",
                className: "group",
              })}
            >
              <UserPlus aria-hidden="true" className="h-4 w-4" />
              Sign in
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-24 lg:pt-20">
      <div className="flex min-h-[30rem] flex-col justify-center">
        <Badge>
          <span className="h-2 w-2 rounded-full bg-success" />
          Offspace Digital Community
        </Badge>

        <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink text-balance sm:text-6xl lg:text-7xl">
          Your space to learn and connect
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
          Join/login our platform to get all the information you need.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="flex justify-center align-middle gap-3 sm:gap-6">
            <Link
              href="/student/login"
              className={buttonVariants({})}
            >
              Log in
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/courses"
              className={buttonVariants({
                variant: "secondary",
              })}
            >
              View courses
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <Link
            href="https://discord.gg/ZmsGE26psx"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({variant:"discord" })}
          >
            <DiscordIcon className="h-4 w-4" />
            Our Discord Community
          </Link>
        </div>
      </div>

      <div className="flex items-center lg:justify-end">
        <Card className="w-full max-w-xl overflow-hidden bg-offwhite/90 shadow-xl backdrop-blur">
          <CardHeader className="border-b border-stone-100">
            <Badge variant="muted" className="w-fit">
              Community platform
            </Badge>
            <CardTitle className="max-w-md text-2xl">
              Everything feels calmer when the right information has a place.
            </CardTitle>
            <CardDescription>
              Offspace brings essential learning details into a focused
              workspace for the people who use them every day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {communityPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 rounded-xs border border-stone-100 bg-ivory-light p-3"
              >
                <CircleCheck aria-hidden="true" className="h-5 w-5 text-forest" />
                <span className="text-sm font-bold text-ink">{point}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-8 border-y border-stone-200 bg-offwhite/70 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Badge variant="muted">About us</Badge>
          <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-ink text-balance sm:text-5xl">
            A soft digital home for creative-tech learning.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft">
            Offspace Digital Community is built for people who want learning to
            feel clear, human, and connected. Students get an organized
            environment where every course touchpoint can support steady
            progress.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {aboutCards.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="bg-ivory-light/80 transition hover:border-sage-300 hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-sage-100 text-forest">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.text}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="bg-forest text-ivory shadow-xl">
          <CardHeader className="p-6 sm:p-8">
            <Sparkles aria-hidden="true" className="h-6 w-6 text-sage-200" />
            <CardTitle className="text-3xl text-ivory">
              Start from your space.
            </CardTitle>
            <CardDescription className="max-w-xl text-sage-100">
              Log in for your student workspace, sign in through managed access,
              or step into the wider Offspace community when the Discord invite
              is connected.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/student/login"
            className="rounded-xs border border-stone-200 bg-offwhite p-5 shadow-sm transition hover:border-sage-300 hover:shadow-md"
          >
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-forest">
              Students
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">
              Open your learning hub
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Reach your course, profile, lesson, and attendance information.
            </p>
          </Link>
          <div
            className="rounded-xs border border-stone-200 bg-offwhite p-5 shadow-sm"
          >
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-forest">
              Community
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">
              Join the conversation
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Connect with the wider Offspace student community once the Discord
              invite is available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiscordIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19.54 5.34A18.1 18.1 0 0 0 15.07 4c-.2.36-.42.84-.58 1.22a16.8 16.8 0 0 0-4.98 0A9.88 9.88 0 0 0 8.93 4a18 18 0 0 0-4.48 1.34C1.62 9.52.85 13.6 1.24 17.62A18.12 18.12 0 0 0 6.73 20.4c.44-.6.84-1.24 1.18-1.92-.65-.24-1.27-.54-1.85-.89l.45-.35a12.93 12.93 0 0 0 10.98 0l.45.35c-.58.35-1.2.65-1.85.89.34.68.74 1.32 1.18 1.92a18.07 18.07 0 0 0 5.49-2.78c.46-4.66-.78-8.7-3.22-12.28ZM8.68 15.15c-1.07 0-1.95-.98-1.95-2.18 0-1.2.86-2.18 1.95-2.18 1.1 0 1.97.99 1.95 2.18 0 1.2-.86 2.18-1.95 2.18Zm6.64 0c-1.07 0-1.95-.98-1.95-2.18 0-1.2.86-2.18 1.95-2.18 1.1 0 1.97.99 1.95 2.18 0 1.2-.86 2.18-1.95 2.18Z" />
    </svg>
  );
}
