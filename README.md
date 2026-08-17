# Offspace Digital Community

Role-based schedule and attendance MVP for Offspace Digital Community.

The current product scope is limited to:

- student login, hub, lessons, enrolled courses, and read-only profile
- mentor login and assigned group schedule/attendance workspace
- Firebase Auth email/password
- Firestore-backed courses, groups, lessons, enrollments, students, mentors, and attendance

## Requirements

- Node.js compatible with Next.js 16.3
- npm
- Firebase project with Authentication and Cloud Firestore enabled

## Environment

Create `.env.local` in the repository root. Do not commit it.

```bash
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=
```

These values are public Firebase web config values. Do not put private service account keys or server secrets in `NEXT_PUBLIC_*` variables.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

Use the narrowest command that covers your change:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` currently runs TypeScript validation. Add a real test runner before treating the project as behavior-tested.

## Firebase Rules

Firestore rules live in `firestore.rules` and are referenced from `firebase.json`.

The rules are written for the current client-read model and improve the repository from having no checked-in rules. Remaining production limitation: the current schema does not let Security Rules prove every assigned-only profile and course read without additional access data. In particular, course documents and mentor/student profile lookups are broader than the ideal least-privilege model because those reads are not denormalized onto assignment documents.

Before production use, add emulator-backed rules tests and consider a read model that includes the exact public profile/course fields needed by each assignment.

## Deployment Notes

No `.firebaserc` is committed because this repository does not contain a confirmed Firebase project ID. Configure the deployment target locally or in CI with the Firebase CLI.
