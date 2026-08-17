# Student And Mentor Auth Flow

## Target Student Flow

`/` -> `/student/login` -> Firebase Auth email/password -> verify `Students/{auth.uid}` -> `/student`

The student hub at `/student` links to:

- `/student/lessons`
- `/student/courses`
- `/student/profile`

## Target Mentor Flow

`/` -> `/mentor/login` -> Firebase Auth email/password -> verify `Mentors/{auth.uid}` -> `/mentor`

Mentors use a separate portal because they have a different hub and different permissions.

## Auth Identity Rule

- Student Firebase Auth UID must match the Firestore document ID at `Students/{uid}`.
- Mentor Firebase Auth UID must match the Firestore document ID at `Mentors/{uid}`.
- Student reads must derive `studentId` from the authenticated Firebase user, not from URL params or hard-coded IDs.
- Mentor reads must derive `mentorId` from the authenticated Firebase user.

## Current Broken Areas Fixed By This Flow

- Demo login previously skipped Firebase Auth and routed directly to dashboards.
- `/student` previously used demo data and a hard-coded student.
- `/student/lessons` previously accepted `studentId` from search params and had a hard-coded default.
- Mentor pages previously used demo assignments instead of mentor-scoped Firestore data.

## Implementation Checklist

- Student login calls `loginWithEmailAndPassword`.
- Student login verifies `Students/{uid}` exists before routing.
- Mentor login calls `loginWithEmailAndPassword`.
- Mentor login verifies `Mentors/{uid}` exists before routing.
- `/student` is a hub for Lessons, Courses, and Profile.
- `/student/lessons` loads lessons for `auth.currentUser.uid`.
- `/student/courses` loads enrollments where `studentId === auth.currentUser.uid`.
- `/student/profile` shows read-only `Students/{uid}` basics.
- `/mentor` loads groups where `mentorId === auth.currentUser.uid`.
