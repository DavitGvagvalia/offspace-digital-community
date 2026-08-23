# Code Documentation

Use these rules when changing code:

- Supabase access is centralized under `app/_lib/supabase`.
- UI code calls repository/data modules rather than raw table queries.
- SQL uses snake_case; app types use camelCase.
- Timestamps are ISO strings in app code.
- Public student self-registration is disabled.
- Super-admin account creation uses server actions and the Supabase secret key.
