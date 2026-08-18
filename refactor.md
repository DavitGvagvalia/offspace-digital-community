# Service And Type Refactor Plan

## Goal

Restructure the current `app/services` and `app/types` buckets so code is organized around the three product flows:

- `student` - student schedule, courses, profile, and personal attendance.
- `mentor` - assigned groups, lessons, students, and attendance management.
- `super-admin` - trusted database control UI for managing core records.

The refactor should make flow-specific code easy to find while keeping shared Firestore primitives centralized and reusable.

## Current Problem

The project currently has two broad shared folders:

```txt
app/services/
app/types/
```

Most files inside those folders are entity-based:

```txt
app/services/attendance.services.ts
app/services/auth.services.ts
app/services/courses.services.ts
app/services/enrollments.services.ts
app/services/groups.services.ts
app/services/lessons.services.ts
app/services/mentors.services.ts
app/services/students.services.ts
app/types/attendance.types.ts
app/types/course.types.ts
app/types/enrollment.types.ts
app/types/group.types.ts
app/types/lesson.types.ts
app/types/mentor.types.ts
app/types/student.types.ts
```

This is fine for low-level data access, but it makes feature work harder because the app is used through role flows, not isolated database entities. Flow-level files already exist in a few places, for example:

```txt
app/services/student-courses.services.ts
app/services/mentor-workspace.services.ts
app/types/student-course-summary.types.ts
app/types/mentor-workspace.types.ts
app/super-admin/mentor-add.ts
```

Those files should move closer to the flow that owns them.

## Target Structure

Keep low-level shared infrastructure under `app/shared`. Put role-facing services and view models inside each role route folder.

```txt
app/
  shared/
    firebase/
      client.ts                 # current app/lib/firebase.ts, if renamed later
      firestore-mappers.ts       # shared Firestore document mappers
      firestore-utils.ts         # generic create/update/delete/get helpers
    data/
      attendance.repository.ts
      courses.repository.ts
      enrollments.repository.ts
      groups.repository.ts
      lessons.repository.ts
      mentors.repository.ts
      students.repository.ts
      queries.repository.ts
    types/
      attendance.ts
      auth.ts
      course.ts
      enrollment.ts
      group.ts
      lesson.ts
      mentor.ts
      student.ts

  student/
    _data/
      auth.ts                    # student login/register/profile access
      courses.ts                 # getStudentCourseSummaries
      lessons.ts                 # student lessons + personal attendance loader
    _types/
      course-summary.ts          # StudentCourseSummary
      lessons.ts                 # StudentLessonsData, selected-course UI state
    courses/
      page.tsx
      course-card.tsx
      student-courses-view.tsx
    lessons/
      page.tsx
      lesson-components.tsx
      lesson-utils.ts
      student-lessons-view.tsx
    login/
      page.tsx
    profile/
      page.tsx
    register/
      page.tsx
      student-registration.tsx

  mentor/
    _data/
      auth.ts                    # mentor login/profile access
      workspace.ts               # getMentorGroupWorkspaces
      attendance.ts              # mentor attendance write operations
    _types/
      workspace.ts               # MentorGroupWorkspace
    login/
      page.tsx
    page.tsx
    mentor-dashboard.tsx
    mentor-workspace-components.tsx

  super-admin/
    _data/
      courses.ts
      groups.ts
      lessons.ts
      mentors.ts
      students.ts
      enrollments.ts
      attendance.ts
    _types/
      database-control.ts
    page.tsx
    mentor-add.ts
```

## Ownership Rules

Use these rules when moving files:

- `app/shared/data/*` owns raw Firestore collection access and entity CRUD.
- `app/shared/types/*` owns canonical database document shapes.
- `app/student/_data/*` owns composed queries for the student experience.
- `app/student/_types/*` owns student-specific view models and UI data shapes.
- `app/mentor/_data/*` owns composed queries and writes for the mentor experience.
- `app/mentor/_types/*` owns mentor-specific view models and UI data shapes.
- `app/super-admin/_data/*` owns super-admin database control actions.
- `app/super-admin/_types/*` owns super-admin-only form and table models.

Flow components should import from their own `_data` and `_types` folders first. They should only import directly from `app/shared/*` when they need canonical shared document types.

## Shared Data Layer

The shared data layer should stay small and mechanical. It should not know about page workflows.

Move current entity services like this:

```txt
app/services/courses.services.ts       -> app/shared/data/courses.repository.ts
app/services/groups.services.ts        -> app/shared/data/groups.repository.ts
app/services/lessons.services.ts       -> app/shared/data/lessons.repository.ts
app/services/enrollments.services.ts   -> app/shared/data/enrollments.repository.ts
app/services/attendance.services.ts    -> app/shared/data/attendance.repository.ts
app/services/students.services.ts      -> app/shared/data/students.repository.ts
app/services/mentors.services.ts       -> app/shared/data/mentors.repository.ts
app/services/queries.services.ts       -> app/shared/data/queries.repository.ts
app/services/firestore-mappers.ts      -> app/shared/firebase/firestore-mappers.ts
app/services/utils.ts                  -> app/shared/firebase/firestore-utils.ts
app/lib/firebase.ts                    -> app/shared/firebase/client.ts
```

Move current canonical types like this:

```txt
app/types/attendance.types.ts          -> app/shared/types/attendance.ts
app/types/auth.types.ts                -> app/shared/types/auth.ts
app/types/course.types.ts              -> app/shared/types/course.ts
app/types/enrollment.types.ts          -> app/shared/types/enrollment.ts
app/types/group.types.ts               -> app/shared/types/group.ts
app/types/lesson.types.ts              -> app/shared/types/lesson.ts
app/types/mentor.types.ts              -> app/shared/types/mentor.ts
app/types/student.types.ts             -> app/shared/types/student.ts
```

Keep collection names, Firestore paths, mappers, and generic document helpers in this shared layer so path strings are not duplicated across flows.

## Student Flow

Student code should be centered on the authenticated student UID.

Target student data modules:

```txt
app/student/_data/auth.ts
app/student/_data/courses.ts
app/student/_data/lessons.ts
app/student/_types/course-summary.ts
app/student/_types/lessons.ts
```

Move current student-specific code:

```txt
app/services/student-courses.services.ts          -> app/student/_data/courses.ts
app/types/student-course-summary.types.ts         -> app/student/_types/course-summary.ts
app/student/lessons/student-lessons-data.ts       -> app/student/_data/lessons.ts
app/student/lessons/lesson-types.ts               -> app/student/_types/lessons.ts
```

Rules:

- Student reads must derive `studentId` from the authenticated Firebase user.
- Student pages should not import mentor or super-admin flow modules.
- Student UI may import shared canonical types such as `Course`, `Lesson`, or `Attendance` when needed.
- Student attendance reads must remain scoped to the current student.

## Mentor Flow

Mentor code should be centered on the authenticated mentor UID.

Target mentor data modules:

```txt
app/mentor/_data/auth.ts
app/mentor/_data/workspace.ts
app/mentor/_data/attendance.ts
app/mentor/_types/workspace.ts
```

Move current mentor-specific code:

```txt
app/services/mentor-workspace.services.ts         -> app/mentor/_data/workspace.ts
app/types/mentor-workspace.types.ts               -> app/mentor/_types/workspace.ts
```

Attendance write operations can be wrapped in `app/mentor/_data/attendance.ts` even if the low-level implementation remains in `app/shared/data/attendance.repository.ts`.

Rules:

- Mentor reads must derive `mentorId` from the authenticated Firebase user.
- Mentor pages should not import student or super-admin flow modules.
- Mentor workspace data should expose the exact objects needed by the dashboard: group, course, lessons, enrolled students, and attendance records.
- Mentor write access must stay limited to attendance for assigned groups unless a future product change explicitly expands the mentor role.

## Super-Admin Flow

Super-admin is a third flow with a different purpose: direct database control through UI.

Target super-admin modules:

```txt
app/super-admin/
  _data/
    courses.ts
    groups.ts
    lessons.ts
    mentors.ts
    students.ts
    enrollments.ts
    attendance.ts
  _types/
    database-control.ts
  page.tsx
  mentor-add.ts
```

The existing file:

```txt
app/super-admin/mentor-add.ts
```

should eventually import mentor creation helpers from `app/super-admin/_data/mentors.ts` or move its helper functions there.

Rules:

- Super-admin UI can manage all core database entities.
- Super-admin code should not be used by student or mentor flows.
- Super-admin writes must use a trusted authorization path before production.
- Do not rely on client-side route checks for super-admin authorization.
- Before production, add Firestore Security Rules and a reliable role source, such as Firebase custom claims or a locked-down admin profile collection.

Important current constraint: the app uses the Firebase Web SDK from client-facing code. Full database control from a browser UI is not production-safe unless Firestore rules enforce the super-admin role. If privileged operations need to bypass normal client permissions, implement them through a trusted server/API/admin SDK path instead of exposing broad client writes.

## Auth Placement

Current `app/services/auth.services.ts` mixes shared auth helpers with role-specific portal behavior.

Recommended split:

```txt
app/shared/auth/firebase-auth.ts       # sign in, sign out, subscribeToAuthState, error mapping
app/shared/auth/portal-access.ts       # getPortalProfile, hasPortalAccess
app/shared/types/auth.ts               # PortalRole, PortalCopy, RequiredProfileState
app/student/_data/auth.ts              # student-specific auth wrappers
app/mentor/_data/auth.ts               # mentor-specific auth wrappers
app/super-admin/_data/auth.ts          # super-admin-specific auth wrappers, when implemented
```

Update `PortalRole` when super-admin login is introduced:

```ts
export type PortalRole = "student" | "mentor" | "super-admin";
```

Only add that role when the UI and authorization model are implemented together.

## Import Direction

Allowed dependencies:

```txt
student -> student/_data -> shared/data -> shared/firebase
mentor -> mentor/_data -> shared/data -> shared/firebase
super-admin -> super-admin/_data -> shared/data -> shared/firebase
components -> shared/auth or flow-local data, depending on ownership
```

Disallowed dependencies:

```txt
student -> mentor
student -> super-admin
mentor -> student
mentor -> super-admin
shared -> student
shared -> mentor
shared -> super-admin
```

This keeps role features independent and prevents accidental permission leaks.

## Migration Plan

1. Create `app/shared/firebase`, `app/shared/data`, `app/shared/types`, and flow-local `_data` / `_types` folders.
2. Move canonical entity types from `app/types` into `app/shared/types`.
3. Move Firestore mappers and generic helpers into `app/shared/firebase`.
4. Move entity CRUD services into `app/shared/data` and update imports.
5. Move `student-courses.services.ts` and student lesson data/types into `app/student/_data` and `app/student/_types`.
6. Move `mentor-workspace.services.ts` and mentor workspace types into `app/mentor/_data` and `app/mentor/_types`.
7. Move or wrap super-admin database operations under `app/super-admin/_data`.
8. Update route components to import from flow-local modules.
9. Delete old `app/services` and `app/types` only after all imports are migrated.
10. Run validation.

Recommended validation:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## Done State

This refactor is complete when:

- No route imports directly from old `app/services/*` or `app/types/*`.
- Shared Firestore collection paths exist in one shared layer.
- Student pages use only student-owned data modules plus shared canonical types.
- Mentor pages use only mentor-owned data modules plus shared canonical types.
- Super-admin pages use only super-admin-owned data modules plus shared canonical types.
- Authorization still derives from authenticated Firebase users, not route params or hard-coded IDs.
- Super-admin production access is protected by server-side authorization or Firestore rules.
