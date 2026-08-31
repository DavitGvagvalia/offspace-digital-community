# Project Structure

This guide explains where code lives and what each area is responsible for.
Use it as the first stop when you are trying to find the right file to change.

## Top-Level Files

- `README.md` - setup, stack, Supabase bootstrap, and validation commands.
- `AGENTS.md` - repository rules for AI agents and contributors.
- `Project_general_information.md` - compact project summary and access model.
- `.env.example` - required environment variable names without secret values.
- `package.json` - scripts and runtime dependencies.
- `next.config.ts` - Next.js configuration.
- `tsconfig.json` - TypeScript configuration.
- `eslint.config.mjs` - ESLint configuration.
- `components.json` - UI component tooling configuration.
- `supabase/` - database migrations and seed templates.
- `public/` - static assets served by Next.js.
- `app/` - the actual Next.js App Router application.

## App Directory Overview

```text
app/
  _data/                Shared repository/data access boundary
  _docs/                Project documentation
  _lib/                 Shared runtime helpers and Supabase clients
  _types/               Shared app-level TypeScript types
  components/           Shared UI/client components
  mentor/               Mentor portal routes, UI, and data composition
  student/              Student portal routes, UI, and data composition
  super-admin/          Super-admin portal routes, UI, and data composition
  globals.css           Global Tailwind/theme styles
  layout.tsx            Root app layout
  page.tsx              Public entry page
```

Next.js route folders are normal URL routes. Folders prefixed with `_` are not
routes; they hold shared code, docs, or types.

## Routes

- `app/page.tsx` - public entry point at `/`.
- `app/student/login/page.tsx` - student login route.
- `app/student/register/page.tsx` - public student registration route.
- `app/student/page.tsx` - student hub route.
- `app/student/lessons/page.tsx` - student lessons and attendance route.
- `app/student/courses/page.tsx` - student courses route.
- `app/student/profile/page.tsx` - read-only student profile route.
- `app/mentor/login/page.tsx` - mentor login route.
- `app/mentor/page.tsx` - mentor dashboard route.
- `app/super-admin/login/page.tsx` - super-admin login route.
- `app/super-admin/page.tsx` - super-admin management portal route.

## Shared Data Layer

`app/_data` is the main boundary between UI code and Supabase tables. UI and
role-specific modules should call these repositories instead of writing raw
queries directly.

- `students.repository.ts` - CRUD-style access for student profile/student rows.
- `mentors.repository.ts` - CRUD-style access for mentor profile/mentor rows.
- `super-admins.repository.ts` - super-admin lookup.
- `courses.repository.ts` - course access plus course mentor eligibility.
- `groups.repository.ts` - group access and soft delete.
- `lessons.repository.ts` - lesson access and soft delete.
- `enrollments.repository.ts` - enrollment access and soft delete.
- `attendance.repository.ts` - attendance row access.
- `queries.repository.ts` - cross-table read queries used by portal screens.
- `portal-access.repository.ts` - role/profile checks after auth login.
- `supabase-errors.ts` - shared Supabase error/data guards.

Repository modules map Supabase snake_case rows into camelCase application
types before returning data to the rest of the app.

## Shared Runtime Helpers

`app/_lib` contains helpers that are shared by more than one role or route.

- `dates.ts` - timestamp conversion and display formatting.
- `session-cache.ts` - in-memory client data cache for route-to-route reuse and
  periodic revalidation.
- `ui/utils.ts` - shared UI utility helpers, currently `cn`.

### Supabase Helpers

`app/_lib/supabase` centralizes Supabase initialization and row mapping.

- `config.ts` - reads and validates Supabase environment variables.
- `client.ts` - creates the browser Supabase client.
- `server.ts` - creates the cookie-aware server Supabase client.
- `admin.ts` - creates the server-only Supabase secret-key client.
- `auth.ts` - browser auth helpers for login, sign-out, auth state, and errors.
- `mappers.ts` - converts database rows into app-level types.

Use `admin.ts` only from server-only code. Do not expose `SUPABASE_SECRET_KEY`
through client components or `NEXT_PUBLIC_*` environment variables.

## Shared Types

`app/_types` contains app-level TypeScript types. These files use camelCase
fields even when the underlying SQL columns are snake_case.

- `student.ts`, `mentor.ts`, `super-admin.ts` - role profile types.
- `course.ts`, `group.ts`, `lesson.ts`, `enrollment.ts`, `attendance.ts` -
  domain model and create/update input types.
- `auth.ts` - portal role/auth-related types.
- `date.ts` - timestamp string type.
- `supabase.ts` - generated Supabase database type definitions.

Regenerate `app/_types/supabase.ts` after schema changes:

```bash
npx supabase gen types typescript --linked > app/_types/supabase.ts
```

## Shared Components

`app/components` contains UI pieces that are reused across portals.

- `portal-login.tsx` - shared login form flow for role portals.
- `use-required-profile.ts` - client-side required-profile hook.
- `auth-states.tsx` - shared auth/loading/empty state pieces.
- `state-panel.tsx` - reusable panel for status, empty, and error states.
- `mascot-background.tsx` - shared Offspace visual background component.

Keep components here only when they are genuinely shared. Role-specific UI
should stay inside its role folder until reuse is proven.

## Student Portal

`app/student` owns student-facing routes, UI, and route-specific data
composition.

- `page.tsx` - student hub page.
- `login/page.tsx` - student login page.
- `register/page.tsx`, `register/student-registration.tsx`, and
  `register/actions.ts` - public student registration form and server action.
- `profile/page.tsx` - read-only student profile page.
- `courses/page.tsx` - route wrapper for student courses.
- `courses/student-courses-view.tsx` - student courses client UI.
- `courses/course-card.tsx` - course summary card component.
- `lessons/page.tsx` - route wrapper for student lessons.
- `lessons/student-lessons-view.tsx` - student lessons client UI.
- `lessons/lesson-components.tsx` - student lesson display components.
- `lessons/lesson-utils.ts` - student lesson formatting/sorting helpers.
- `_data/auth.ts` - student profile lookup after auth.
- `_data/courses.ts` - builds student course summaries.
- `_data/enrollments.ts` - student enrollment state and enrollment action.
- `_data/lessons.ts` - builds student lesson course data.
- `_types/course-summary.ts` - student course summary types.
- `_types/lessons.ts` - student lesson view types.
- `studentFlow.md` - student-flow notes.

Student UI should only show data for the authenticated student. Authorization
must come from Supabase auth, RLS, and repository/data functions, not route
params or local state alone.

## Mentor Portal

`app/mentor` owns mentor-facing routes, UI, and assigned-group data
composition.

- `page.tsx` - mentor dashboard route.
- `login/page.tsx` - mentor login page.
- `mentor-dashboard.tsx` - mentor dashboard client UI.
- `mentor-workspace-components.tsx` - mentor workspace display components.
- `_data/auth.ts` - mentor profile lookup after auth.
- `_data/workspace.ts` - builds mentor group workspace data.
- `_data/lessons.ts` - lesson create/update actions for assigned groups.
- `_data/attendance.ts` - attendance add/delete actions.
- `_types/workspace.ts` - mentor workspace view types.

Mentor behavior must stay scoped to groups assigned to the authenticated mentor.

## Super-Admin Portal

`app/super-admin` owns the management portal for MVP setup data and account
creation.

- `page.tsx` - super-admin management route.
- `login/page.tsx` - super-admin login page.
- `super-admin-dashboard.tsx` - super-admin dashboard client UI.
- `mentor-add.ts` - mentor creation form/action support.
- `_data/account-actions.ts` - server actions for creating student and mentor
  Supabase Auth accounts plus profile rows.
- `_data/person-details.ts` - composed student/mentor detail views.
- `_data/students.ts`, `_data/mentors.ts`, `_data/courses.ts`,
  `_data/groups.ts`, `_data/lessons.ts`, `_data/enrollments.ts`,
  `_data/attendance.ts` - super-admin re-exports of shared repository actions.
- `_types/database-control.ts` - super-admin dashboard/control types.

Super-admin account creation is the main place that uses the server-only
Supabase secret-key client.

## Documentation

`app/_docs` contains human-facing documentation.

- `README.md` - documentation entry point.
- `_code-documentation/` - implementation, architecture, data, auth, setup, and
  structure notes.
- `_usage-documentation/` - role flow documentation for non-code behavior.

## Supabase Directory

`supabase` contains database files used by the hosted Supabase project.

- `migrations/20260823000000_initial_supabase_schema.sql` - initial schema,
  policies, and database setup.
- `seed.sql` - local/hosted seed data where applicable.
- `seed_after_auth_template.sql` - template for seed rows that need existing
  Auth users.
- `.temp/` - Supabase CLI metadata for the linked project.

Do not put application secrets in migrations, seed files, or docs.

## Public Assets

`public` contains static assets served from the site root.

- `offspace-otter.png` - Offspace mascot image.
- `offspace-vines.svg` - Offspace decorative vine asset.

## Common Change Paths

- Add or change a database table: update `supabase/migrations`, regenerate
  `app/_types/supabase.ts`, add/update mapper types, then update repositories.
- Add a shared data operation: add it to `app/_data`, then consume it from the
  relevant role `_data` module.
- Add a role-specific screen: add or update the route folder under
  `app/student`, `app/mentor`, or `app/super-admin`.
- Add role-specific composed data: put it in that role's `_data` folder.
- Add truly shared UI: put it in `app/components`; otherwise keep it local to
  the route or role folder.
- Add a date display rule: update `app/_lib/dates.ts`.
- Change Supabase auth/client behavior: update `app/_lib/supabase`.

## Validation After Changes

Run the relevant checks before shipping a change:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
