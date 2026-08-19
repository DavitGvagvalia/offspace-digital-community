# Authentication And Authorization

## Auth Provider

The app uses Firebase Auth email/password through the Firebase Web SDK.

Shared auth helpers live in `app/_lib/firebase/auth.ts`:

- `loginWithEmailAndPassword`
- `subscribeToAuthState`
- `signOutCurrentUser`
- `getFirebaseLoginMessage`

## Role Access

Role access is derived from Firebase Auth UID plus a matching profile document:

- Student access requires `Students/{uid}`.
- Mentor access requires `Mentors/{uid}`.
- Super-admin access requires `SuperAdmins/{uid}`.

`app/components/use-required-profile.ts` enforces this on protected portal pages. `app/components/portal-login.tsx` also checks role access immediately after login.

Do not authorize users from route params, search params, local state, or user-entered IDs.

## Student Registration

`app/student/register/student-registration.tsx` creates a Firebase Auth account and then creates `Students/{uid}` through `registerStudentAccount` in `app/student/_data/auth.ts`.

If profile creation fails, the code attempts to delete the newly created Firebase Auth user. If deletion fails, it signs out the current user.

## Super-Admin Account Creation

The super-admin dashboard creates student and mentor Firebase Auth accounts from the browser using a secondary Firebase app:

- `app/super-admin/_data/students.ts`
- `app/super-admin/_data/mentors.ts`

This prevents the current super-admin's Auth session from being replaced by the newly created user.

Important limitation: the client can create Firebase Auth users only through Firebase client SDK capabilities. It is not a trusted admin backend. Profile writes still depend on Firestore Security Rules.

## Firestore Rules Summary

Rules live in `firestore.rules`.

Confirmed rule behavior:

- Students can create their own `Students/{uid}` profile during registration.
- Students can read their own profile.
- Mentors can read student profiles, subject to the current broader rule noted below.
- Super-admins can list, create, update, and delete student and mentor profile documents.
- Super-admin client access to `SuperAdmins` is read-only for the current user's own document.
- Course documents are readable by portal users but not listable.
- Groups and lessons are readable by the assigned mentor or an enrolled current student.
- Lessons can be created, updated, and deleted by the group's mentor.
- Enrollments are readable when the record belongs to the current student or mentor.
- Attendance is readable by the attendance student or assigned group mentor.
- Attendance can be created and updated by the assigned group mentor when the student is actively enrolled in the group.
- Attendance can be deleted by the assigned group mentor.

Known least-privilege limitation from `README.md`: the current schema does not let Security Rules prove every assigned-only profile and course read without additional access data. Course documents and mentor/student profile lookups are broader than an ideal production model.

## Production Checklist

Before production use:

- Add Firebase Emulator tests for `firestore.rules`.
- Verify every query path is covered by rules and indexes.
- Avoid adding private keys or service account credentials to the frontend.
- Consider a denormalized read model for exact assignment-based profile and course access.
- Move privileged account management to a trusted backend if stronger admin guarantees are required.

