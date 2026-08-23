# Supabase Migration Notes

The project has been migrated from Firebase Auth + Cloud Firestore to Supabase
Auth + Supabase Postgres.

## Confirmed Decisions

- Supabase Auth replaces Firebase Auth.
- Supabase Postgres replaces Firestore.
- Supabase Free is acceptable for MVP launch by user decision.
- No Firebase rollback path is required because existing Firebase data was test
  data only.
- Public student self-registration is disabled.
- Super-admins create student and mentor accounts.
- Payments, invoices, and private-student mentor workspaces are deferred.
- Hosted Supabase project only; no local Docker Supabase stack is required for
  MVP setup.

## Current Repository State

- Firebase runtime dependency has been uninstalled.
- Firebase deploy files have been removed:
  - `firebase.json`
  - `firestore.rules`
- Supabase runtime dependencies are installed:
  - `@supabase/supabase-js`
  - `@supabase/ssr`
- Supabase clients live under `app/_lib/supabase`.
- App-level data access goes through repository modules in `app/_data`.
- Database types live in `app/_types/supabase.ts`.
- Initial SQL migration lives at
  `supabase/migrations/20260823000000_initial_supabase_schema.sql`.

## Environment Setup

Create `.env.local` from `.env.example`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- `NEXT_PUBLIC_SUPABASE_URL` is safe for browser use.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is safe for browser use when Row Level
  Security is correct.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in client
  components, browser logs, screenshots, or `NEXT_PUBLIC_*` variables.

## Hosted Project Migration

Use the Supabase CLI through `npx`; do not add it as a committed dependency.

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

After any schema change, regenerate committed database types:

```bash
npx supabase gen types typescript --linked > app/_types/supabase.ts
```

Then run validation:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## First Super-Admin Bootstrap

Create the first auth user manually in Supabase Dashboard.

Then run this SQL with the created auth user id:

```sql
insert into public.profiles (id, role, name, last_name, email)
values ('<auth-user-id>', 'super_admin', '<name>', '<last-name>', '<email>');

insert into public.super_admins (user_id)
values ('<auth-user-id>');
```

The application expects role authorization from `profiles.role` plus the
matching role table row. Super-admin-created student and mentor accounts also
mirror the role into Supabase Auth `app_metadata`.

## Manual Parity Checks

After the hosted database is migrated and the first super-admin exists, verify:

- Student login redirects to `/student`.
- Student profile loads only the signed-in student's profile.
- Student courses load active enrollments.
- Student lessons show assigned group lessons and personal attendance.
- Mentor login redirects to `/mentor`.
- Mentor dashboard shows only assigned groups.
- Mentor attendance toggle writes attendance only for assigned group lessons.
- Super-admin login redirects to `/super-admin`.
- Super-admin can create student and mentor auth accounts.
- Super-admin can assign courses, groups, mentors, and students for the MVP.

## Owner Questions Before Launch

1. Which Supabase project ref should this repository link to for the MVP?
2. What email should be used for the first manually bootstrapped super-admin?
3. Should super-admin-created users receive Supabase invitation emails, or
   should the MVP use temporary passwords that you share manually?
4. Should student and mentor emails be required immediately, or can accounts be
   created with email as an optional profile field later?
5. Should deleted records stay hidden forever for MVP, or do you want a
   super-admin restore flow before launch?
6. Should attendance remain exactly `row exists = attended`, or do you want an
   explicit absence record before real students are entered?
7. Are private students still deferred until after group-based schedule and
   attendance are stable?
8. Do you want backups before moving beyond MVP, despite choosing no backup
   requirement for the first Supabase Free launch?
