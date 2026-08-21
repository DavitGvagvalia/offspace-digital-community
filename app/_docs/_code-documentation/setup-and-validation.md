# Setup And Validation

## Requirements

- Node.js compatible with Next.js `16.3.0`.
- npm.
- A Firebase project with Email/Password Authentication enabled.
- Cloud Firestore enabled.

## Environment Variables

Create `.env.local` at the repository root. Do not commit it.

```bash
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=
```

These are Firebase web configuration values. Do not put private service account keys or server secrets in `NEXT_PUBLIC_*` variables.

Firebase initialization is centralized in `app/_lib/firebase/client.ts`. The app throws at startup if any required Firebase public config value is missing.

## Install And Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation Commands

Use the narrowest useful command for the change.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Current scripts:

- `npm run lint`: runs ESLint.
- `npm run typecheck`: runs `tsc --noEmit`.
- `npm test`: currently delegates to `npm run typecheck`.
- `npm run build`: runs `next build`.

`npm test` is not a behavioral test suite yet. Add a real test runner before treating the project as behavior-tested.

## UI Library Setup

The project is configured for shadcn/ui-style components:

- `components.json` stores shadcn/ui path and style configuration.
- Add reusable generated components under `app/components/ui`.
- Use `app/_lib/ui/utils.ts` for the shared `cn` helper.
- Use Radix primitives directly when low-level accessible behavior is needed.
- Use `lucide-react` for common UI icons.

When adding shadcn/ui components, prefer targeted additions rather than a large
bulk install. Example:

```bash
npx shadcn@latest add button dialog checkbox popover tooltip tabs
```

## Firebase Rules

Firestore rules live in `firestore.rules` and are referenced by `firebase.json`.

Before production use:

- Run or add Firebase Emulator tests for the rules.
- Confirm every query used by the client is allowed by rules and indexed where Firestore requires composite indexes.
- Review the README note that the current client-read schema has least-privilege limitations for some profile and course lookups.
