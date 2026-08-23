# Application Architecture

The app remains client-heavy for the current MVP.

- `app/_lib/supabase/client.ts` creates the browser client.
- `app/_lib/supabase/server.ts` creates the cookie-aware server client.
- `app/_lib/supabase/admin.ts` creates the server-only secret-key client.
- `app/_data` contains shared repository modules.
- Role folders contain route-specific data composition.

Repository modules map snake_case Supabase rows into camelCase app types.
