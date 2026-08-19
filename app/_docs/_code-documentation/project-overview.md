# Project Overview

## Product

Offspace Digital Community is currently implemented as a role-based schedule and attendance web app.

The main user-facing capabilities confirmed in code are:

- Public landing page with links to student login, mentor login, student registration, and super-admin login.
- Student email/password login.
- Student self-registration with Firebase Auth account creation and a matching `Students/{uid}` profile document.
- Student hub with links to lessons, courses, and profile.
- Student lessons view showing enrolled courses, scheduled lessons, and personal attendance.
- Student courses view showing active enrollment details.
- Student read-only profile view.
- Mentor email/password login.
- Mentor dashboard showing groups assigned to the authenticated mentor.
- Mentor schedule and attendance workspace for assigned group students and lessons.
- Super-admin email/password login.
- Super-admin dashboard for listing, creating, and removing student and mentor profile access.

## Tech Stack

Confirmed from `package.json`:

- Next.js `16.3.0`
- React `19.2.8`
- TypeScript
- Tailwind CSS `4`
- Firebase Web SDK `12.17.1`
- ESLint

## Important Paths

- `app/page.tsx`: public entry point.
- `app/student`: student routes and feature code.
- `app/mentor`: mentor routes and feature code.
- `app/super-admin`: super-admin routes and feature code.
- `app/components`: shared UI and auth/profile helpers.
- `app/_data`: shared Firestore repository modules.
- `app/_lib/firebase`: Firebase initialization, auth wrapper, Firestore utilities, and mappers.
- `app/_types`: shared TypeScript data types.
- `firestore.rules`: checked-in Firestore Security Rules.
- `firebase.json`: Firebase rules configuration.

## Product Scope Boundaries

The repository guidance limits the MVP to schedule, attendance, role login, and role dashboards. Do not add unrelated LMS, payment, messaging, homework, parent, certificate, notification, video, payroll, or marketplace functionality unless explicitly requested.

Private students are mentioned in repository guidance and there are `PrivateStudents` helper stubs in `courses.repository.ts`, but current Firestore rules deny reads and writes under `Courses/{courseId}/PrivateStudents/{studentId}` and the active UI does not implement a private-student workspace.

