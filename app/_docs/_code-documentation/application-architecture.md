# Application Architecture

The app remains client-heavy for the current MVP.

- `app/_lib/supabase/client.ts` creates the browser client.
- `app/_lib/supabase/server.ts` creates the cookie-aware server client.
- `app/_lib/supabase/admin.ts` creates the server-only secret-key client.
- `app/_data` contains shared repository modules.
- Role folders contain route-specific data composition.

Repository modules map snake_case Supabase rows into camelCase app types.

Client route data uses an in-memory session cache for repeated reads during
client-side navigation. The cache resets on full page refresh or browser close.
It does not store database records in `localStorage`, `sessionStorage`, or
cookies.

## Main Boundaries

- `app/_lib/supabase` owns Supabase setup and should be the only place that
  creates Supabase clients.
- `app/_data` owns shared database operations and table-level repository logic.
- `app/student/_data`, `app/mentor/_data`, and `app/super-admin/_data` compose
  repository calls into screen-ready data for each portal.
- Route files and UI components should consume data modules instead of querying
  Supabase tables directly.
- Repeated client reads should use `app/_lib/session-cache.ts` so data loaded on
  one route can be reused after navigating to another route.
- Shared types live in `app/_types`; role-specific view types live inside the
  matching role folder.

For a file-by-file map, see `project-structure.md`.
