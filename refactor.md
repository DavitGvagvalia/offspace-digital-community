# Refactor Audit

Date: 2026-08-17

This audit is based on local repository inspection and reproducible commands. It does not assume production configuration, private Firebase rules, or schemas that are not present in the repo.

## Validation Snapshot

Commands run from the repository root:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Results:

- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `npm test` failed because `package.json` currently has no `test` script.
- `npm run build` failed with a Turbopack internal error while processing `app/globals.css`: `creating new process`, `binding to a port`, `Operation not permitted (os error 1)`.

The build failure may be environment/tooling related because the panic log does not include an application stack trace beyond CSS transformation. Recheck after dependency cleanup and in the intended local/CI environment.

## High Priority

### Missing Firestore Security Rules

No `firestore.rules`, `firebase.json`, `.firebaserc`, or other Firebase rules/config files were found in the repository. The app reads Firestore directly from client components and services through the Firebase Web SDK.

Why it matters:

- Client-side role checks are not a security boundary.
- Firebase documentation states that Security Rules are the safeguard for direct client access.
- The product requires students and mentors to see only their own or assigned data.

Recommended direction:

- Add Firebase project config and Firestore Security Rules.
- Express the UID ownership rules for `Students/{uid}` and `Mentors/{uid}`.
- Add rules for `Enrollments`, `Attendances`, nested `Groups`, nested `Lessons`, and any future private assignment model.
- Add emulator-backed tests for allowed and denied reads.

Evidence:

- `firebase.js`
- `app/services/*.services.ts`
- No Firebase rules/config files found by local file search.
- Reference: https://firebase.google.com/docs/rules/basics

### Missing Test Script

`package.json` does not define a `test` script, so `npm test` fails with `Missing script: "test"`.

Recommended direction:

- Add a real test script using a runner such as Vitest for units and Playwright for browser flows, or temporarily set a truthful placeholder that does not pretend tests exist.
- Add tests for auth gating, route access, student lesson visibility, mentor group scoping, and Firestore service aggregation.

Evidence:

- `package.json`
- `npm test`
- Local Next docs: `node_modules/next/dist/docs/01-app/02-guides/testing/index.md`

### Student Lessons Omit Unattended Schedule Items

`getStudentLessonCourses` loads enrollments and `getAttendedLessonsByStudent`, then groups lessons from attendance records. A scheduled lesson without an attendance record is not shown to the student.

Why it matters:

- The MVP requires schedule visibility, not only attendance history.
- Upcoming lessons will likely have no attendance record yet.

Recommended direction:

- Load lessons from the enrolled course/group schedule.
- Join personal attendance records onto those lessons.
- Represent missing attendance as `not marked` or an equivalent UI state.

Evidence:

- `app/student/lessons/student-lessons-data.ts`
- `app/services/queries.services.ts`

### Build Is Not Currently Trustworthy

`npm run build` fails with a Turbopack internal error while transforming `app/globals.css`. `npm ls --depth=0` also reports several extraneous packages in `node_modules`.

Recommended direction:

- Clean install dependencies from `package-lock.json`.
- Re-run `npm run build` in a normal local shell and in CI.
- If it still fails, isolate Tailwind/PostCSS/Turbopack with the panic log and local Next docs before changing app code.

Evidence:

- `npm run build`
- Turbopack panic log under `/private/var/folders/.../next-panic-*.log`
- `npm ls --depth=0`

## Medium Priority

### `AGENTS.md` Was Empty

The working tree had an empty `AGENTS.md`, while the tracked version contained important MVP scope and the Next.js managed agent-rules block.

Why it matters:

- Future agent sessions lose the product boundaries and Next.js version-specific guidance.
- Next.js 16.3 expects the managed block to remain so agents read bundled docs.

Recommended direction:

- Keep `AGENTS.md` populated with product, code, security, and validation guidance.
- Keep project-specific guidance outside the managed `nextjs-agent-rules` block.

Evidence:

- `AGENTS.md`
- `git show HEAD:AGENTS.md`
- Local Next docs: `node_modules/next/dist/docs/01-app/02-guides/ai-agents.md`

### Private Student Scope Is Not Implemented In Active UI

The product scope includes private / 1-on-1 student workspaces, and `courses.services.ts` has `PrivateStudents` helpers, but the active mentor dashboard only lists groups.

Recommended direction:

- Decide the private assignment Firestore model before implementation.
- Add private assignments to mentor navigation only after the data shape and rules are explicit.
- Share schedule/attendance rendering with group workspaces where possible.

Evidence:

- `AGENTS.md`
- `app/services/courses.services.ts`
- `app/mentor/mentor-dashboard.tsx`
- `app/mentor/mentor-workspace-components.tsx`

### Demo And Authenticated Flows Coexist

Legacy demo components and data remain alongside the Firebase-authenticated portal flow.

Why it matters:

- Future edits may accidentally use demo data in authenticated views.
- Unused demo code increases search noise and makes product state harder to verify.

Recommended direction:

- Either remove demo-only components/data or move them under an explicit demo-only route/folder.
- Keep authenticated pages free of demo fallbacks unless they are explicitly test doubles.

Evidence:

- `app/lib/demo-data.ts`
- `app/lib/copy.ts`
- `app/components/demo-login.tsx`
- `app/components/schedule-attendance.tsx`
- `app/components/app-frame.tsx`
- `app/student/discover/page.tsx`

### Seed Script Has App-Service Side Effects

`app/services/test.ts` contains seed helpers and calls `seedSampleData()` at module top level.

Why it matters:

- Importing the module can mutate Firestore.
- It lives under `app/services`, which makes it look like production service code.
- It contains hard-coded IDs and partially commented sample seeding.

Recommended direction:

- Move seeding to a clearly named script folder such as `scripts/seed-sample-data.ts`.
- Remove top-level execution from importable modules.
- Require explicit environment loading and a deliberate command to seed.

Evidence:

- `app/services/test.ts`

### Firebase Initialization Is Untyped Root JavaScript

`firebase.js` is a root-level JavaScript file in a strict TypeScript project. It reads `NEXT_PUBLIC_*` variables but does not validate required values before initialization.

Recommended direction:

- Move Firebase setup into TypeScript, for example `app/lib/firebase.ts` or `src/lib/firebase.ts` if the project later adopts `src`.
- Validate required public Firebase config values at startup with a clear error.
- Keep public Firebase config values under `NEXT_PUBLIC_*`; do not put private secrets in client code.

Evidence:

- `firebase.js`
- `tsconfig.json` has `strict: true` and `allowJs: true`.
- Local Next docs: `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`
- Firebase config reference: https://firebase.google.com/docs/web/learn-more

### Raw Firestore Data Is Cast Directly To App Types

Several helpers map `document.data()` into objects and cast them to app interfaces. This trusts Firestore data shape at runtime.

Why it matters:

- TypeScript does not validate remote data.
- Missing or malformed timestamps can break UI formatting.
- Incorrect fields can pass through until runtime.

Recommended direction:

- Use Firestore converters or small validation functions at service boundaries.
- Keep fallback behavior explicit, especially for user-facing schedule and attendance data.

Evidence:

- `app/services/utils.ts`
- `app/services/queries.services.ts`
- `app/services/courses.services.ts`

### N+1 Firestore Read Patterns

Aggregate services load related data with per-record lookups.

Examples:

- Student course summaries fetch course, group, and mentor for each enrollment.
- Mentor workspaces fetch course, lessons, enrollments, attendances, then each student for each group.
- Student lesson data loads attendance lessons individually through `getLesson`.

Recommended direction:

- Keep this for small MVP datasets only if performance is acceptable.
- Batch by IDs, denormalize read models, or create query-specific aggregate documents when data grows.
- Add loading and error tests around partial missing references.

Evidence:

- `app/services/student-courses.services.ts`
- `app/services/mentor-workspace.services.ts`
- `app/student/lessons/student-lessons-data.ts`
- `app/services/queries.services.ts`

### Mentor Naming Should Stay Consistent

Routes, UI, services, types, and Firestore collection names should use `mentor` consistently.

Recommended direction:

- Keep `mentor` as the product vocabulary for user-facing code.
- Keep Firestore collection naming aligned with `Mentors`.
- Avoid reintroducing legacy role naming in new files unless a third-party API requires it.

Evidence:

- `app/mentor/*`
- `app/services/mentors.services.ts`
- `app/services/mentor-workspace.services.ts`
- `app/types/mentor.types.ts`
- `app/types/mentor-workspace.types.ts`

## Lower Priority

### README Is Still Boilerplate

`README.md` is mostly the default create-next-app text and does not explain the Offspace MVP, Firebase setup, env vars, validation commands, or known limitations.

Recommended direction:

- Replace it with project-specific setup and verification instructions.
- Document required Firebase public env vars without committing actual `.env.local` values.
- Include known current validation failures until fixed.

Evidence:

- `README.md`

### Root/App Organization Could Be Clearer

Next.js allows project files to live in `app`, but the current layout mixes route files, global shared components, demo code, services, types, and feature-specific data helpers.

Recommended direction:

- Keep route-specific components near routes when only one route uses them.
- Move shared app libraries into a clear shared location.
- Consider `src/` only as a deliberate larger reorganization, not as a drive-by refactor.

Evidence:

- `app/components`
- `app/services`
- `app/types`
- `app/student/lessons/*`
- Local Next docs: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`

## Reference Sources

- Local Next.js AI agent guide: `node_modules/next/dist/docs/01-app/02-guides/ai-agents.md`
- Local Next.js project structure guide: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- Local Next.js testing guide: `node_modules/next/dist/docs/01-app/02-guides/testing/index.md`
- Local Next.js environment variables guide: `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`
- Firebase Security Rules basics: https://firebase.google.com/docs/rules/basics
- Firebase web config reference: https://firebase.google.com/docs/web/learn-more
