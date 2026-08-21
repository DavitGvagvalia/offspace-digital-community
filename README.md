# Offspace Digital Community

Role-based schedule and attendance MVP for Offspace Digital Community.

For a consolidated repository-derived summary of the project's purpose,
current usage, data model, routes, validation, security notes, and open
questions, see [Project_general_information.md](./Project_general_information.md).

The current product scope is limited to:

- student login, hub, lessons, enrolled courses, and read-only profile
- student course selection on the student portal when the student has no existing enrollments
- student enrollment into one or more active courses, even before group assignment
- student email/password registration with profile document creation
- mentor login and assigned group schedule/attendance workspace
- Firebase Auth email/password
- Firestore-backed courses, groups, lessons, enrollments, students, mentors, and attendance

## Target Student MVP Flow

After a student logs into the student portal, the main student page should check
whether the authenticated student has existing enrollments. If no enrollments
exist, the page should show an available-course selection block. The student can
select multiple active courses, and submitting the selection creates one active
enrollment per selected course.

Group assignment is not required at initial enrollment time. Until a group is
assigned, student-facing course and lesson views should show a clear message:
`Your mentor will assign group soon.`

The student courses page is the later place for students to view available
courses and enroll in additional courses. Editing selected courses is not part
of the first MVP implementation.

The student lessons page should show the student's enrolled courses and a
vertical timeline of past lessons conducted in the student's assigned group.
Lesson details should be available on hover and tap/click, and should include
the lesson date plus the student's attendance status. Attendance is boolean for
the MVP: attended or not attended.

## Requirements

- Node.js compatible with Next.js 16.3
- npm
- Firebase project with Authentication and Cloud Firestore enabled

## UI Component Standard

Use `shadcn/ui` as the preferred component pattern for new reusable UI and
Radix primitives when lower-level accessible behavior is needed. Components
should live under `app/components/ui` and use the shared `cn` helper from
`app/_lib/ui/utils.ts`.

Keep Offspace visual styling in Tailwind utilities and theme tokens from
`app/globals.css`. Do not introduce a broad competing component suite unless a
specific workflow justifies the extra dependency and design-system cost.

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
