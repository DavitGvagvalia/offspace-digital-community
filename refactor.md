# MVP Refactor Goal

Refactor the current codebase from the existing schedule/attendance implementation into the newly defined Offspace Digital Community MVP.

The refactor must align runtime behavior, types, Firestore data access, Firestore rules, and documentation with the updated student MVP flow in `README.md`, `AGENTS.md`, `app/_docs`, and `Project_general_information.md`.

## Product Target

The MVP remains a role-based schedule and attendance app with these core flows:

- Student: account access, course selection/enrollment, enrolled course overview, past lesson timeline, and personal attendance.
- Mentor: assigned teaching workspace, group assignment where applicable, lesson/attendance management for assigned students.
- Super-admin: existing support flow for account access, course availability, mentor course assignment, and student group assignment where explicitly needed for the MVP.

Do not expand into a general LMS, payments, messaging, homework, files, certificates, parent accounts, notifications, video lessons, analytics, marketplace, or other broader platform features.

## UI Refactor Priority

Use the configured shadcn/ui pattern as the primary way to build reusable UI for
the MVP refactor.

- Put shared generated/adapted components under `app/components/ui`.
- Use `cn` from `app/_lib/ui/utils.ts`.
- Use Radix primitives directly when shadcn components are too high-level or do not fit the workflow.
- Use `lucide-react` icons for controls and actions.
- Keep visual styling aligned with Offspace Tailwind tokens in `app/globals.css`.
- Avoid adding another broad UI suite unless the workflow need is explicit.

## Student MVP Refactor Requirements

### First Student Portal Visit Without Enrollments

When an authenticated student opens `/student`, the app must check for existing enrollments using the authenticated Firebase UID.

If no enrollments exist:

- Show an available-course selection block on the main student page.
- List active courses from Firestore.
- Allow selecting multiple courses.
- Create one active enrollment per selected course.
- Allow enrollment before group assignment.

Enrollment status `active` means the student selected the course. It does not mean a mentor or group has already been assigned.

### Pending Group Assignment

The target MVP must support enrolled courses without a group assignment.

For those courses:

- `groupId` should be empty/null or otherwise explicitly optional in the enrollment model.
- Student-facing pages must show:

```text
Your mentor will assign group soon.
```

Current implementation constraint: existing types, mappers, Firestore rules, and queries require `groupId` and `mentorId` on enrollment records. Refactor these together before enabling pending group assignment.

### Student Lessons

The student lessons page must:

- Show all courses enrolled by the authenticated student.
- For courses with an assigned group, show a vertical timeline of past lessons conducted in that group.
- Exclude future lessons for this MVP.
- Show lesson details on hover and tap/click.
- Show lesson date and the student's attendance status.
- Use boolean attendance semantics: attended or not attended.
- For courses without an assigned group, show the pending group assignment message.

The student must never see another student's attendance.

### Student Courses

The student courses page must:

- Show the student's enrolled courses.
- Show group assignment status.
- Later support browsing active available courses and enrolling in additional courses.

Changing or removing already selected courses is intentionally deferred until after the first MVP behavior is implemented.

## Data Model Refactor Requirements

### Courses

Course documents currently contain course definition fields such as `name`, `description`, `active`, and timestamps.

The target MVP needs course-level mentor eligibility metadata because mentors can be assigned to teach a course before groups are assigned.

Implemented schema:

```ts
mentorIds: string[]
```

This refactor uses `Courses/{courseId}.mentorIds` because course eligibility is
course-scoped metadata, the current UI reads course documents directly, and the
expected update frequency is low for the MVP.

### Enrollments

Current enrollment records require:

- `studentId`
- `courseId`
- `groupId`
- `mentorId`
- `price`
- `status`
- `enrolledAt`

The target MVP must support a student-selected course before group assignment.

Refactor enrollment handling so:

- `studentId` is always the authenticated student UID for student-created enrollments.
- `courseId` is required.
- `status` starts as `active`.
- `groupId` can be empty/null until assignment.
- `mentorId` can be empty/null until assignment unless a confirmed course-level mentor assignment is chosen at enrollment time.
- Enrollment IDs no longer depend only on `{studentId}_{groupId}`, because `groupId` can be missing.

Implemented enrollment ID format: `{studentId}_{courseId}` for one enrollment
per student per course. Future repeated enrollment into the same course would
require a new ID strategy.

### Attendance

Attendance remains linked to assigned group lessons.

For the MVP, attendance is boolean:

- attended
- not attended

The current implementation represents this as presence or absence of an attendance document. Keep that model unless an explicit boolean field is required for clearer rules or UI.

## Firestore Rules Refactor Requirements

Update `firestore.rules` with the data model changes.

Rules must enforce:

- Students can create enrollments only for themselves.
- Students can only read their own enrollments and attendance.
- Students can read active available courses needed for course selection.
- Pending enrollments without a group do not grant access to group lessons.
- Group lesson reads are allowed only after the student is assigned to that group.
- Mentors and super-admins can only perform assignment writes that the MVP explicitly requires.
- Client-side checks are not treated as sufficient authorization.

Add Firebase Emulator rules tests before treating the rules as production-ready.

## Refactor Work Plan

1. Confirm the enrollment ID strategy.
2. Confirm the course-to-mentor assignment schema.
3. Update canonical types in `app/_types`.
4. Update Firestore mappers in `app/_lib/firebase/firestore-mappers.ts`.
5. Update shared repositories in `app/_data`.
6. Add student enrollment creation and active-course query functions.
7. Refactor `/student` to show the course-selection block when the student has no enrollments.
8. Refactor `/student/lessons` for pending group assignment and past-lesson timeline behavior.
9. Refactor `/student/courses` for enrolled course status and future additional enrollment support.
10. Update mentor/super-admin assignment data paths only as needed for the MVP.
11. Update `firestore.rules` for pending enrollments and assignment permissions.
12. Update docs when implementation details are confirmed.
13. Run validation.

## Validation

Use the narrowest useful validation while working. Before considering the refactor complete, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Add Firebase Emulator tests for Firestore rules before production use.

## Done State

The MVP refactor is complete when:

- Student course selection appears on `/student` only when the authenticated student has no enrollments.
- Multiple selected active courses create active enrollments.
- Enrollments can exist before group assignment.
- Student pages clearly show `Your mentor will assign group soon.` for unassigned enrollments.
- Student lessons show only past lessons from assigned groups in a vertical timeline.
- Hover and tap/click reveal lesson date and boolean attendance status.
- Students cannot read other students' attendance.
- Types, mappers, repositories, rules, and UI agree on optional group assignment.
- Course-to-mentor assignment is represented consistently.
- Firestore rules match the new MVP access model.
- Documentation matches implemented behavior and known limitations.
