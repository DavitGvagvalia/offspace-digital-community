import { ArrowRight, BookOpenCheck, CircleDollarSign } from "lucide-react";
import Link from "next/link";

import { createAdminSupabaseClient } from "../_lib/supabase/admin";
import type { Database } from "../_types/supabase";
import { MascotBackground } from "../components/mascot-background";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type PublicCourse = Pick<CourseRow, "id" | "name" | "description">;

async function getPublicCourses(): Promise<PublicCourse[]> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id,name,description")
    .eq("active", true)
    .is("deleted_at", null)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export default async function CoursesPage() {
  const courses = await getPublicCourses();

  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory text-ink">
      <MascotBackground className="-bottom-20 -right-44 h-[22rem] w-[44rem] rotate-[-5deg] opacity-80" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-[36rem] bg-contain bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/offspace-vines.svg')" }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-forest hover:text-forest-light"
          >
            Back home
          </Link>
          <p className="text-sm font-semibold text-ink-soft">Courses</p>
        </header>

        <section className="py-12 sm:py-16">
          <Badge>
            <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
            Public courses
          </Badge>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink text-balance sm:text-5xl">
                Available Offspace courses
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
                Browse active courses before signing in. Enrolling opens the
                student login flow so your course choice stays connected to your
                student account.
              </p>
            </div>
            <Link
              href="/student/login"
              className={buttonVariants({ variant: "secondary" })}
            >
              Student login
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {courses.length === 0 ? (
          <section className="rounded-md border border-stone-200 bg-offwhite p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
              Course list
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              No active courses
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              There are no public courses available right now.
            </p>
          </section>
        ) : (
          <section
            aria-label="Available courses"
            className="grid gap-4 pb-16 md:grid-cols-2 lg:grid-cols-3"
          >
            {courses.map((course) => (
              <Card
                key={course.id}
                className="flex h-full flex-col bg-offwhite/90 shadow-md backdrop-blur"
              >
                <CardHeader>
                  <Badge variant="muted" className="w-fit">
                    Available
                  </Badge>
                  <CardTitle className="text-2xl">{course.name}</CardTitle>
                  <CardDescription>
                    {course.description ?? "Course details will be added soon."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <div className="flex items-center justify-between gap-4 rounded-xs border border-stone-100 bg-ivory-light p-3">
                    <span className="flex items-center gap-2 text-sm font-bold text-ink">
                      <CircleDollarSign
                        aria-hidden="true"
                        className="h-4 w-4 text-forest"
                      />
                      Price
                    </span>
                    <span className="text-sm font-semibold text-ink-soft">
                      Not published
                    </span>
                  </div>

                  <Link
                    href="/student/login"
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Enroll
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
