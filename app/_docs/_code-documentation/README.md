# Code Documentation

Use these rules when changing code:

- Supabase access is centralized under `app/_lib/supabase`.
- UI code calls repository/data modules rather than raw table queries.
- SQL uses snake_case; app types use camelCase.
- Timestamps are ISO strings in app code.
- Public student self-registration is enabled at `/student/register`.
- Student self-registration and super-admin account creation use server actions
  and the Supabase secret key.
