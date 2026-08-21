# Project General Information

## Evidence Standard

This document summarizes project purpose and usage based on the repository state at the time of review. Confirmed facts are drawn from local files such as `README.md`, `AGENTS.md`, `package.json`, `firestore.rules`, `app/page.tsx`, `app/_docs`, route files, type definitions, Firebase helpers, and repository modules.

Anything not proven by those files is listed as an open question rather than treated as fact.

## Project Purpose

Offspace Digital Community is currently a role-based schedule and attendance web application.

The documented MVP scope in `AGENTS.md` is focused on:

- Student schedule and attendance access.
- Mentor schedule and attendance management for assigned groups.
- Firebase Auth email/password login.
- Firestore-backed profiles, courses, groups, lessons, enrollments, and attendance records.

The current codebase also includes a super-admin portal. The super-admin portal is documented as current repository behavior, while `AGENTS.md` still defines the MVP product scope primarily around student and mentor schedule and attendance flows.

## Current Product Scope

Confirmed in repository guidance and code:

- Public home page with portal links.
- Student login.
- Student self-registration.
- Student active-course selection when the student has no existing enrollments.
- Student enrollment into one or more selected courses before group assignment.
- Student hub.
- Student lessons and personal attendance view.
- Student enrolled courses view.
- Student read-only profile view.
- Mentor login.
- Mentor assigned group dashboard.
- Mentor group workspace with lessons, students, and attendance controls.
- Super-admin login.
- Super-admin profile access management for student and mentor accounts.
- Firestore Security Rules checked into the repository.

Explicitly out of scope unless the project owner requests otherwise:

- Full LMS functionality.
- Admin dashboards beyond confirmed current super-admin behavior.
- Payments.
- Messaging.
- Homework.
- File uploads.
- Certificates.
- Payroll.
- Parent accounts.
- Notifications.
- Video lessons.
- Complex analytics.
- Public course marketplace.

## Confirmed Portals And Routes

| Route | Purpose |
| --- | --- |
| `/` | Public entry point with links to student login, mentor login, student registration, and super-admin login. |
| `/student/login` | Student email/password login. |
| `/student/register` | Student self-registration. |
| `/student` | Student hub. |
| `/student/lessons` | Student schedule and personal attendance. |
| `/student/courses` | Student enrolled courses. |
| `/student/profile` | Student read-only profile. |
| `/mentor/login` | Mentor email/password login. |
| `/mentor` | Mentor assigned-group dashboard and attendance workspace. |
| `/super-admin/login` | Super-admin email/password login. |
| `/super-admin` | Super-admin profile access management for student and mentor profiles. |

## User Roles

### Student

Students can:

- Register through `/student/register`.
- Sign in through `/student/login`.
- Open a hub at `/student`.
- Select one or more active available courses when they have no existing enrollments.
- Enroll in selected courses before group assignment.
- See a waiting-for-group-assignment message when no group is assigned yet.
- View enrolled courses.
- View past lessons conducted in their assigned group by enrolled course.
- View only their own boolean attendance status.
- View read-only profile details.

Students cannot currently:

- Edit profile details.
- Create or edit courses.
- Create or edit groups.
- Create or edit lessons.
- Mark attendance.
- View other students' attendance.
- Change already selected courses in the first MVP implementation.

### Mentor

Mentors can:

- Sign in through `/mentor/login`.
- View groups assigned to their authenticated mentor account.
- Open a selected group workspace.
- View the group's course, lessons, enrolled students, and attendance records.
- Mark and unmark attendance for assigned students and group lessons.

Mentors cannot currently:

- Manage unrelated groups.
- Create student accounts from the mentor dashboard.
- Edit course enrollment setup from the mentor dashboard.
- Use a private-student workspace in the active UI.

### Super-Admin

Super-admins can:

- Sign in through `/super-admin/login`.
- View student and mentor profile directories.
- Create student Firebase Auth accounts and matching student profiles.
- Create mentor Firebase Auth accounts and matching mentor profiles.
- Remove student or mentor Firestore profile access.
- Open student or mentor detail views in the dashboard.

Important limitation: the current super-admin portal uses client Firebase SDK capabilities. It is not a trusted admin backend. Removing portal access deletes the Firestore profile document, but the Firebase Auth account remains until removed from a trusted admin backend.

Super-admin profiles cannot be created from the client app. They must be bootstrapped outside the application.

## Authentication And Authorization

Authentication uses Firebase Auth email/password through the Firebase Web SDK.

Authorization is derived from the authenticated Firebase user's UID and a matching portal profile document:

- Student access requires `Students/{uid}`.
- Mentor access requires `Mentors/{uid}`.
- Super-admin access requires `SuperAdmins/{uid}`.

Protected portal pages use `useRequiredProfile(role)` from `app/components/use-required-profile.ts`.

Login pages use `PortalLogin` from `app/components/portal-login.tsx`, which signs in with Firebase Auth and checks role access before routing to the portal.

Authorization must not be derived from route params, search params, local state, or user-entered IDs.

## Data Model

The app reads and writes Cloud Firestore using the Firebase Web SDK.

Confirmed collections and document paths:

- `Students/{studentId}`
- `Mentors/{mentorId}`
- `SuperAdmins/{superAdminId}`
- `Courses/{courseId}`
- `Courses/{courseId}/Groups/{groupId}`
- `Courses/{courseId}/Groups/{groupId}/Lessons/{lessonId}`
- `Enrollments/{enrollmentId}`
- `Attendances/{attendanceId}`
- `Courses/{courseId}/PrivateStudents/{studentId}` exists as a referenced path, but current rules deny reads and writes and the active UI does not implement it.

Important ID formats:

- Student profile ID should match Firebase Auth UID.
- Mentor profile ID should match Firebase Auth UID.
- Super-admin profile ID should match Firebase Auth UID.
- Firestore rules expect enrollment IDs in the format `{studentId}_{courseId}`.
- Attendance writes use IDs in the format `{studentId}_{lessonId}`.

Important field summaries:

- Students: `name`, `lastName`, optional `email`, optional `phone`, `createdAt`, optional `updatedAt`.
- Mentors: `name`, `lastName`, optional `email`, optional `phone`, `active`, `createdAt`.
- Super-admins: optional `name`, optional `lastName`, optional `email`, optional `createdAt`.
- Courses: `name`, optional `description`, `active`, `createdAt`, optional `mentorIds: string[]`, optional `updatedAt`.
- Groups: `courseId`, optional `name`, `mentorId`, `active`, `createdAt`, optional `updatedAt`.
- Lessons: `courseId`, `groupId`, optional `title`, optional `description`, `date`, `createdAt`, optional `updatedAt`.
- Enrollments: `studentId`, `courseId`, `status`, `enrolledAt`, optional `groupId`, optional `mentorId`, optional `price`, optional `completedAt`, optional `updatedAt`.
- Attendances: `studentId`, `courseId`, `groupId`, `lessonId`, `attendedAt`; MVP attendance is boolean attended/not attended.

Enrollment statuses:

- `active`
- `paused`
- `completed`
- `cancelled`

Firestore mappers in `app/_lib/firebase/firestore-mappers.ts` return `null` when required fields are missing or invalid. Repository list calls filter those records out, so malformed Firestore documents can disappear from the UI without a visible error.

Implemented target MVP data-model decisions:

- Enrollments support selected-course records before group assignment.
- Enrollment IDs use `{studentId}_{courseId}` for one enrollment per student per course.
- Course documents represent mentor eligibility as `mentorIds: string[]`.
- Student lesson queries ignore future lessons and show only past lessons conducted in the student's assigned group.

## Usage Summary

### Starting The App

1. Install dependencies with `npm install`.
2. Create `.env.local` in the repository root with required Firebase public web config values.
3. Start the local app with `npm run dev`.
4. Open `http://localhost:3000`.

### Required Environment Variables

```bash
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=
```

These are public Firebase web configuration values. Do not store private service account keys or server secrets in `NEXT_PUBLIC_*` variables.

Firebase initialization is centralized in `app/_lib/firebase/client.ts`. The app throws at startup if any required Firebase public config value is missing.

### Student Usage

1. Register at `/student/register` or sign in at `/student/login`.
2. Use the student hub at `/student`.
3. If no enrollments exist, select one or more active available courses from the main student page.
4. After selection, the app creates one active enrollment per selected course.
5. If a course has no assigned group yet, the app shows `Your mentor will assign group soon.`
6. Open `/student/lessons` to view enrolled courses and a vertical timeline of past lessons conducted in the assigned group.
7. Hover or tap/click a lesson to see its date and boolean attendance status.
8. Open `/student/courses` to view enrollment details and later enroll in additional available courses.
9. Open `/student/profile` to view read-only profile details.

### Mentor Usage

1. Sign in at `/mentor/login`.
2. Use `/mentor` to load assigned groups.
3. Select a group to view course, lessons, students, and attendance.
4. Toggle attendance for assigned students and lessons in that group.

### Super-Admin Usage

1. Sign in at `/super-admin/login`.
2. Use `/super-admin` to view student and mentor directories.
3. Create student or mentor accounts using the dashboard forms.
4. Open profile details from the directory entries.
5. Remove portal profile access when needed.

## Technical Stack

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
- npm scripts for development, linting, type-checking, testing, building, and starting production builds.

## Important Code Areas

- `app/page.tsx`: public entry point.
- `app/student`: student routes, student pages, and student feature data modules.
- `app/mentor`: mentor routes, mentor dashboard, and mentor workspace data modules.
- `app/super-admin`: super-admin routes, dashboard, and account/profile management modules.
- `app/components`: shared UI, login, auth state, and profile enforcement helpers.
- `app/_data`: shared Firestore repository modules.
- `app/_lib/firebase`: Firebase initialization, auth helpers, Firestore utilities, and mappers.
- `app/_lib/ui/utils.ts`: shared `cn` helper for shadcn-style component classes.
- `components.json`: shadcn/ui configuration for component paths, Tailwind CSS file, and icon library.
- `app/_types`: shared TypeScript data types.
- `app/_docs`: engineering and usage documentation.
- `public`: Offspace visual assets used by the UI.
- `firestore.rules`: Firestore authorization rules.
- `firebase.json`: Firebase rules configuration.

## Design Direction

Confirmed guidance:

- Use the existing Offspace visual system.
- Primary brand color is `#123524`.
- Tailwind theme tokens live in `app/globals.css`.
- Prefer shadcn/ui patterns for new reusable UI components.
- Use Radix primitives directly for lower-level accessible behavior.
- Use lucide-react icons for interface controls and actions.
- Put shared shadcn-style components under `app/components/ui`.
- Use `cn` from `app/_lib/ui/utils.ts` for conditional class merging.
- Prefer Tailwind utilities over large custom CSS component classes.
- Keep the UI calm, practical, modern, friendly, and responsive.
- Prioritize data clarity and permissions over decorative polish.
- Avoid adding another broad UI component suite unless a specific workflow justifies the added dependency and styling surface.

## Validation Commands

Use the narrowest validation command that covers a change:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Current script behavior:

- `npm run lint` runs ESLint.
- `npm run typecheck` runs `tsc --noEmit`.
- `npm test` currently delegates to `npm run typecheck`.
- `npm run build` runs `next build`.

`npm test` is not currently a behavioral test suite.

## Security And Production Notes

Firestore rules are checked in at `firestore.rules` and referenced from `firebase.json`.

Confirmed current rule behavior includes:

- Students can create their own profile during registration.
- Students can read their own profile.
- Super-admins can list, create, update, and delete student and mentor profile documents.
- Super-admin client access to `SuperAdmins` is read-only for the current user's own document.
- Course documents are readable by portal users but not listable.
- Groups and lessons are readable by the assigned mentor or enrolled current student.
- Lessons can be created, updated, and deleted by the assigned group mentor, although the current active mentor UI focuses on attendance.
- Enrollments are readable when the record belongs to the current student or mentor.
- Attendance is readable by the attendance student or assigned group mentor.
- Attendance can be created, updated, and deleted by the assigned group mentor when the student is actively enrolled in the group.

Known production limitations:

- Client-side checks are not sufficient by themselves.
- The current schema does not let Firestore rules prove every assigned-only profile and course read with ideal least privilege.
- Course documents and some mentor/student profile lookups are broader than the ideal production model.
- Super-admin account management should move to a trusted backend for stronger administration guarantees.
- Emulator-backed Firestore rules tests should be added before production use.
- Query coverage and required Firestore indexes should be verified against the deployed database.
- No `.firebaserc` is committed because the repository does not contain a confirmed Firebase project ID.

## Open Questions For The Project Owner

1. Is the current MVP officially student and mentor only, or should super-admin be treated as part of the MVP only for account and assignment workflows?
2. Should student self-registration remain enabled long term, or only for the first MVP?
3. Who is responsible for bootstrapping the first `SuperAdmins/{uid}` document?
4. Should super-admin account management move to a backend API before launch?
5. What production Firebase project should this repository target?
6. Should a `.firebaserc` be committed once the project ID is confirmed?
7. What environments are required: local, staging, production, or more?
8. Are separate Firebase projects required per environment?
9. What is the expected release process?
10. Who can deploy the app and Firestore rules?
11. What hosting target should be used?
12. What Node.js version should be standardized for developers and CI?
13. Should the app support only English, or are Georgian and other languages required?
14. What exact fields are required for student profiles in production?
15. What exact fields are required for mentor profiles in production?
16. Should students be able to edit their own profile details?
17. Should mentors be able to edit their own profile details?
18. Should inactive mentors be blocked from signing in or only hidden from assignment workflows?
19. Should inactive groups or enrollments appear in student views?
20. Should paused, completed, and cancelled enrollments be visible to students after the first MVP?
21. Should mentors see paused, completed, or cancelled enrollments?
22. What does `price` represent in enrollments, and should students see it?
23. Should attendance eventually support statuses beyond the MVP boolean attended/not attended model?
24. Should attendance record who marked or changed it?
25. Should attendance changes be auditable?
26. Should attendance be editable after a lesson date has passed?
27. Should students see lesson descriptions, titles, both, or a different schedule format in the timeline detail?
28. Should mentors be able to create, update, or delete lessons from the mentor portal?
29. Should mentors be able to view private students in this MVP?
30. If private students are needed, what Firestore schema should represent them?
31. How are courses and groups created today?
32. Should future repeated enrollment in the same course require changing the current `{studentId}_{courseId}` ID format?
33. Should `Courses/{courseId}.mentorIds` stay sufficient if mentor eligibility updates become high-frequency or permission-sensitive?
34. Should deleting a profile also disable or delete the Firebase Auth account?
35. What data retention rules apply to attendance and enrollment records?
36. Are there privacy or compliance requirements for student personal data?
37. Should Firestore rules use a denormalized read model for stricter least privilege?
38. Which Firestore queries need composite indexes in production?
39. Should Firebase Emulator tests be added for security rules before any launch?
40. What behavioral test runner should be used for UI and data flows?
41. What CI checks should run on every pull request?
42. What browser and device targets are required?
43. Should the app support offline or poor-network usage?
44. What empty, loading, and error states are most important for real users?
45. Should the student course selector stay horizontal on all screen sizes?
46. Are the current Offspace colors and mascot assets final?
47. What is the expected visual tone for super-admin screens?
48. Are notifications, reminders, or calendar integration intentionally out of scope for this MVP?
49. What production analytics or logging, if any, is allowed?
50. What definition of done should be used before this project is considered production-ready?
