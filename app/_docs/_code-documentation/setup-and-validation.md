# Setup And Validation

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Apply the hosted Supabase schema:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Generate database types:

```bash
npx supabase gen types typescript --linked > app/_types/supabase.ts
```

Validation:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
