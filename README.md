# Offspace Digital Community

Role-based schedule and attendance web app for Offspace Digital Community.

## Active Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Supabase Auth email/password
- Supabase Postgres with Row Level Security
- Supabase Free plan for MVP launch

Firebase has been removed from the active runtime, dependency list, and deploy
configuration. Existing Firebase data was test data only and no rollback path is
required.

## Product Scope

The active MVP supports student, mentor, and super-admin portals for courses,
groups, lessons, enrollments, and boolean attendance.

Deferred: public student self-registration, payments, invoices, private-student
mentor workspaces, messaging, homework, file uploads, certificates, payroll,
parent accounts, notifications, video lessons, analytics, and broad LMS
features.

## Setup

```bash
npm install
```

Create `.env.local` from `.env.example`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY` is server-only. Never expose it through a `NEXT_PUBLIC_*`
variable.

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Schema

The initial schema migration is in `supabase/migrations`.

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Generate database types after schema changes:

```bash
npx supabase gen types typescript --linked > app/_types/supabase.ts
```

## First Super-Admin Bootstrap

Create the first Supabase Auth user manually in the Supabase Dashboard. Then add
matching rows:

```sql
insert into public.profiles (id, role, name, last_name, email)
values ('<auth-user-id>', 'super_admin', '<name>', '<last-name>', '<email>');

insert into public.super_admins (user_id)
values ('<auth-user-id>');
```

The super-admin portal can then create student and mentor accounts.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
