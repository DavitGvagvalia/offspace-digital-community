# Project General Information

This repository is a Next.js role-based schedule and attendance app for
Offspace Digital Community.

## Current Architecture

- Next.js App Router
- TypeScript and React
- Tailwind CSS
- Supabase Auth email/password
- Supabase Postgres
- Supabase Row Level Security

Firebase has been removed from active runtime and deployment configuration.

## Required Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY` is server-only and is used by server actions for student
self-registration and super-admin account creation.

## Data Model

Canonical Supabase tables:

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

Application types use camelCase fields. SQL tables use snake_case fields.
Timestamps are ISO strings in application code.

Attendance is boolean for the MVP: an `attendances` row means the student
attended the lesson.

## Access Model

- Students can self-register, choose active courses, and read only their own
  profile, enrollments, lessons, and attendance.
- Mentors read assigned groups and related students, lessons, and attendance.
- Super-admins manage profiles, courses, groups, lessons, enrollments, and
  account creation.
- Student self-registration is enabled through `/student/register`.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
