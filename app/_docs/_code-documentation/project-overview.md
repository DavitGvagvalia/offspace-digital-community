# Project Overview

## Product

Offspace Digital Community is currently implemented as a role-based schedule and attendance web app.

The main user-facing capabilities confirmed in code are:

- Public landing page with links to student login, mentor login, student registration, and super-admin login.
- Student email/password login.
- Student self-registration with Firebase Auth account creation and a matching `Students/{uid}` profile document.
- Student hub with links to lessons, courses, and profile.
- Target student hub behavior where students with no existing enrollments can select one or more active courses.
- Target enrollment behavior where selected courses create active enrollments even before group assignment.
- Student lessons view showing enrolled courses, past conducted group lessons, and personal boolean attendance.
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
- shadcn/ui project configuration
- Radix UI primitives
- lucide-react icons
- ESLint

## Important Paths

- `app/page.tsx`: public entry point.
- `app/student`: student routes and feature code.
- `app/mentor`: mentor routes and feature code.
- `app/super-admin`: super-admin routes and feature code.
- `app/components`: shared UI and auth/profile helpers.
- `app/_data`: shared Firestore repository modules.
- `app/_lib/firebase`: Firebase initialization, auth wrapper, Firestore utilities, and mappers.
- `app/_lib/ui/utils.ts`: shared `cn` class merging helper for shadcn-style components.
- `components.json`: shadcn/ui configuration.
- `app/_types`: shared TypeScript data types.
- `firestore.rules`: checked-in Firestore Security Rules.
- `firebase.json`: Firebase rules configuration.

## UI Component Direction

New reusable UI should prioritize shadcn/ui patterns with Tailwind styling and
Offspace theme tokens. Use Radix primitives directly for accessible low-level
behaviors when a shadcn component is not the right fit. Prefer `lucide-react`
icons for controls and actions.

Avoid adopting another broad component suite unless a specific workflow
justifies the added styling and dependency surface.

## Product Scope Boundaries

The repository guidance limits the MVP to schedule, attendance, role login, and role dashboards. Do not add unrelated LMS, payment, messaging, homework, parent, certificate, notification, video, payroll, or marketplace functionality unless explicitly requested.

Private students are mentioned in repository guidance and there are `PrivateStudents` helper stubs in `courses.repository.ts`, but current Firestore rules deny reads and writes under `Courses/{courseId}/PrivateStudents/{studentId}` and the active UI does not implement a private-student workspace.

## Target Student MVP Additions

The project owner clarified the intended student MVP flow:

- A student with no existing enrollments should see an active-course selection block on `/student` after login.
- The course selection should allow multiple answers.
- Each selected course should create an active enrollment.
- Active enrollment means the student selected the course; it does not require group assignment yet.
- If no group is assigned, student-facing pages should show `Your mentor will assign group soon.`
- The lessons page should show enrolled courses and a vertical timeline of past lessons conducted in the student's assigned group.
- Lesson details should be visible on hover and on tap/click for touch devices.
- Attendance is boolean for the MVP: attended or not attended.
- The courses page is the intended place for students to browse active available courses and enroll in additional courses after the initial no-enrollment flow.

Implementation note: enrollment records now support pending group assignment by
using `{studentId}_{courseId}` document IDs and optional `groupId`/`mentorId`
fields.
