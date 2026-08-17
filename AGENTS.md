# AGENTS.md

# Offspace Digital Community - Schedule MVP

This file is the source of truth for AI agents working in this repository. Follow it before making code changes.

## Product Scope

The current product is not the full Offspace platform. The only product functionality in scope is a role-based schedule and attendance web application for Offspace Digital Community.

The MVP supports two authenticated roles:

- Student
- Mentor

Do not add admin dashboards, payments, messaging, homework, file uploads, certificates, payroll, parent accounts, notifications, video lessons, complex analytics, a public course marketplace, or broader LMS functionality unless explicitly requested.

## Current Routes

Use the existing Next.js App Router structure unless a requested change clearly requires a route change.

- `/` - public entry point with links to role login pages
- `/student/login` - student login
- `/student` - student hub
- `/student/lessons` - student lessons and personal attendance
- `/student/courses` - student enrolled courses
- `/student/profile` - student profile
- `/mentor/login` - mentor login
- `/mentor` - mentor dashboard

Use `mentor` consistently for routes, UI, services, types, and docs.

## Authentication And Permissions

Authentication uses Firebase Auth email/password. Authorization must be derived from the authenticated Firebase user, not from route params, search params, or hard-coded IDs.

- Student Firebase Auth UID must match `Students/{uid}`.
- Mentor Firebase Auth UID must match `Mentors/{uid}` in the current codebase.
- Student reads must derive `studentId` from the authenticated user.
- Mentor reads must derive `mentorId` from the authenticated user.
- Students must only see their own courses, lessons, and attendance.
- Mentors must only see assigned groups, private students, schedules, and attendance.
- Client-side checks are not sufficient for production. Firestore Security Rules are required before production use.

## Core Data Model

The current Firestore model is client-read through the Firebase Web SDK.

- `Students` - student profiles keyed by Firebase Auth UID
- `Mentors` - mentor profiles keyed by Firebase Auth UID
- `Courses` - course definitions
- `Courses/{courseId}/Groups` - groups for a course
- `Courses/{courseId}/Groups/{groupId}/Lessons` - lessons for a group
- `Enrollments` - top-level student-course-group-mentor links
- `Attendances` - top-level attendance records linked to student, course, group, and lesson


## Student Experience

The student interface is centered on the courses assigned to the current student.

- `/student` should remain a simple hub for student pages.
- `/student/lessons` should let the student choose among their courses and view schedule plus personal attendance.
- `/student/courses` should show active course enrollment details.
- `/student/profile` should show read-only student profile basics.
- Students must not see other students' attendance.

The student course selector should remain horizontal where practical. On small screens it may scroll horizontally or use compact tabs, but avoid confusing multi-row course navigation.

## Mentor Experience

The mentor interface is centered on assigned teaching entities.

- The dashboard should expose a clear list/sidebar of assigned groups.
- Private students are part of the intended MVP, but the current active UI does not implement them.
- A selected group workspace should show schedule and attendance for that group.
- The mentor should understand which group, course, lessons, students, and attendance statuses are being viewed.
- Do not add unrelated group-management or admin tools unless requested.

## UI Direction

Use the existing Offspace visual system.

- Primary brand color: `#123524`
- Use existing Tailwind theme tokens in `app/globals.css`.
- Prefer Tailwind utilities over large custom CSS component classes.
- Keep the UI calm, practical, modern, friendly, and responsive.
- Avoid generic enterprise school-dashboard aesthetics, dense unnecessary tables, childish education visuals, and one-off colors.
- Prioritize data clarity and permissions over decorative polish.

## Code Structure Rules

- This is a Next.js App Router project using TypeScript, React, Tailwind CSS, and Firebase.
- Read relevant local Next.js docs under `node_modules/next/dist/docs/` before changing framework-specific APIs or conventions.
- Keep runtime code TypeScript-first. Avoid adding new root-level JavaScript files.
- Keep Firebase initialization and Firestore/Auth access centralized.
- Do not duplicate Firestore path strings when a shared helper or service boundary already exists.
- Avoid unchecked casts from Firestore data when changing data access. Prefer typed converters or explicit validation for user-facing data.
- Keep components small and local to their feature until reuse is proven.
- Do not create broad abstractions before they remove real duplication or risk.
- Do not silently expand product scope beyond schedule, attendance, role login, and role dashboards.

## Validation

Run the narrowest useful validation for the change. For broad or structural edits, use:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## Current Product Definition

A role-based schedule and attendance web application for Offspace Digital Community, where mentors manage schedules and attendance for assigned groups and private students, while students browse their courses and view schedule plus personal attendance for each course.

Treat this definition as the current MVP source of truth unless the project owner explicitly changes it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
