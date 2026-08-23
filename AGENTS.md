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

Private-student mentor workspaces and public student self-registration are
deferred.

## Current Routes

- `/` - public entry point
- `/student/login` - student login
- `/student/register` - managed-registration notice
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
- Super-admin user creation uses server-only Supabase secret-key access.
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

Students can view their hub, courses, profile, assigned lessons, and personal
attendance. Enrollments can exist before group assignment and must show
`Your mentor will assign group soon.`

Mentors can view assigned groups and mark attendance only for assigned group
lessons.

Super-admins create student and mentor Supabase Auth accounts and manage the
MVP setup data needed for courses, groups, lessons, enrollments, and attendance.
The first super-admin is bootstrapped manually in Supabase.

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
