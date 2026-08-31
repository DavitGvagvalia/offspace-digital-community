# Code Documentation

Start here:

- `project-structure.md` explains what each major directory and file does.
- `application-architecture.md` explains the main code boundaries.
- `authentication-and-authorization.md` explains portal access rules.
- `data-model.md` explains the canonical Supabase tables.
- `feature-flows.md` explains current role behavior.
- `setup-and-validation.md` explains environment and validation commands.

Use these rules when changing code:

- Supabase access is centralized under `app/_lib/supabase`.
- UI code calls repository/data modules rather than raw table queries.
- SQL uses snake_case; app types use camelCase.
- Timestamps are ISO strings in app code.
<<<<<<< HEAD
- Public student self-registration is enabled at `/student/register`.
- Student self-registration and super-admin account creation use server actions
  and the Supabase secret key.
=======
- Public student self-registration is available at `/student/register`.
- Student and super-admin account creation use server actions for privileged
  profile-table writes; the Supabase secret key stays server-only.
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
