# AGENTS.md

This file is the source of truth for AI agents working in this repository.

## Product Scope

The product is a role-based schedule and attendance web application for
Offspace Digital Community.

Current roles:

- Student
- Mentor
- Super-admin

Do not add payments, messaging, homework, file uploads, certificates, payroll,
parent accounts, notifications, video lessons, complex analytics, public course
marketplaces, or broad LMS behavior unless explicitly requested.

<<<<<<< HEAD
Private-student mentor workspaces are deferred.
=======
Private-student mentor workspaces are deferred. Public student
self-registration is supported through `/student/register`.
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)

## Current Routes

- `/` - public entry point
- `/student/login` - student login
<<<<<<< HEAD
- `/student/register` - public student self-registration
=======
- `/student/register` - public student registration
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
- `/student` - student hub
- `/student/lessons` - student lessons and personal attendance
- `/student/courses` - enrolled courses
- `/student/profile` - read-only student profile
- `/mentor/login` - mentor login
- `/mentor` - mentor dashboard
- `/super-admin/login` - super-admin login
- `/super-admin` - super-admin management portal

## Authentication And Permissions

Authentication uses Supabase Auth email/password.

Authorization is derived from the authenticated Supabase user and Postgres data,
not from route params, search params, local state, or hard-coded IDs.

- `profiles.id` references `auth.users.id`.
- Student access requires `profiles.role = 'student'` and a `students` row.
- Mentor access requires `profiles.role = 'mentor'` and a `mentors` row.
- Super-admin access requires `profiles.role = 'super_admin'` and a
  `super_admins` row.
- Students must only see their own enrollments, lessons, and attendance.
- Mentors must only see assigned groups, students, lessons, and attendance.
<<<<<<< HEAD
- Super-admin user creation uses server-only Supabase secret-key access.
- Student self-registration creates Supabase Auth, `profiles`, and `students`
  records through a server action.
=======
- Privileged Auth/profile creation uses server-only Supabase secret-key access.
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
- Browser reads and writes must be protected by Supabase Row Level Security.

## Core Data Model

The canonical database is Supabase Postgres.

Core tables:

- `profiles`
- `students`
- `mentors`
- `super_admins`
- `courses`
- `course_mentor_eligibility`
- `groups`
- `lessons`
- `enrollments`
- `attendances`

Important conventions:

- Use snake_case table/column names in SQL.
- Use camelCase app-level TypeScript types.
- Keep Supabase access centralized under `app/_lib/supabase`.
- Keep repository/data modules as the boundary between UI and SQL tables.
- Timestamps are ISO strings in application types.
- Attendance is boolean for the MVP: row exists means attended.
- Important deletes are soft deletes through `deleted_at`.
- Payments and invoices are intentionally deferred.

## Experience

Students can self-register, view their hub, courses, profile, assigned lessons,
and personal attendance. Students can select active courses when they have no
enrollments. Enrollments can exist before group assignment and must show
`Your mentor will assign group soon.`

Mentors can create groups for courses they are eligible to teach, view active
unassigned enrollments for those courses, assign selected pending students while
creating a group, and mark attendance only for assigned group lessons.

<<<<<<< HEAD
Super-admins can create student and mentor Supabase Auth accounts and manage
the MVP setup data needed for courses, groups, lessons, enrollments, and
attendance. Super-admins assign the courses a mentor can teach from the mentor
details modal. The first super-admin is bootstrapped manually in Supabase.
=======
Students can self-register student Supabase Auth accounts. Super-admins create
mentor Supabase Auth accounts and can still manage MVP setup data needed for
courses, groups, lessons, enrollments, and attendance. The first super-admin is
bootstrapped manually in Supabase.
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)

## UI Direction

- Use the existing Offspace visual system.
- Primary brand color: `#123524`.
- Use Tailwind utilities and existing theme tokens in `app/globals.css`.
- Use `lucide-react` icons when adding icon actions.
- Keep the UI calm, practical, responsive, and data-clear.

## Code Structure Rules

- This is a Next.js App Router project using TypeScript, React, Tailwind CSS,
  and Supabase.
- Read relevant local Next.js docs under `node_modules/next/dist/docs/` before
  changing framework-specific APIs or conventions.
- Keep runtime code TypeScript-first.
- Do not add new root-level JavaScript files.
- Keep Supabase initialization centralized.
- Do not duplicate table names or query logic when a repository boundary exists.
- Avoid unchecked casts when changing data access; prefer mappers or generated
  Supabase types.
- Keep components small and local until reuse is proven.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
