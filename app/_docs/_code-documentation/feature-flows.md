# Feature Flows

## Public Entry

`app/page.tsx` exposes links to:

- `/student/login`
- `/mentor/login`
- `/student/register`
- `/super-admin/login`

## Student Login

1. Student opens `/student/login`.
2. `PortalLogin` signs in with Firebase Auth.
3. `hasPortalAccess("student", uid)` checks for `Students/{uid}`.
4. On success, the user is routed to `/student`.
5. On role mismatch, the user is signed out and shown an access error.

## Student First Portal Course Selection

Target MVP behavior from the project owner:

1. Student signs in and opens `/student`.
2. The page checks enrollments for the authenticated student.
3. If no enrollments exist, the page shows an available-course selection block.
4. The block lists active courses.
5. The student can select multiple courses.
6. Submitting creates one active enrollment per selected course.
7. Enrollment can be created before group assignment; `groupId` should be empty/null until a mentor or super-admin assigns the student to a group.
8. Courses without group assignment should show `Your mentor will assign group soon.` in student-facing course and lesson contexts.

Implementation note: the current code and Firestore rules expect enrollment records to include `groupId` and `mentorId`, and current rules expect enrollment IDs in the format `{studentId}_{groupId}`. Implementing this target flow requires a data-model and rules update.

## Student Registration

1. Student opens `/student/register`.
2. User submits name, last name, email, optional phone, password, and password confirmation.
3. Password confirmation is checked client-side.
4. Firebase Auth account is created.
5. `Students/{uid}` is created with profile fields.
6. On success, the user is routed to `/student`.

## Student Lessons

Primary files:

- `app/student/lessons/page.tsx`
- `app/student/lessons/student-lessons-view.tsx`
- `app/student/_data/lessons.ts`

Flow:

1. `useRequiredProfile("student")` verifies the current user and student profile.
2. `getStudentLessonCourses(user.uid)` loads enrollments for the student.
3. For each enrollment with an assigned group, the app loads the course, group lessons, and that student's attendance records for the group.
4. For each enrollment without an assigned group, the app shows `Your mentor will assign group soon.`
5. The target MVP UI shows enrolled courses and a vertical timeline of past lessons conducted in the student's assigned group.
6. Lesson details are available on hover and on tap/click, and include lesson date plus boolean attendance status.

## Student Courses

Primary files:

- `app/student/courses/page.tsx`
- `app/student/courses/student-courses-view.tsx`
- `app/student/_data/courses.ts`

Flow:

1. `useRequiredProfile("student")` verifies the current user and student profile.
2. `getStudentCourseSummaries(user.uid)` loads enrollments.
3. For each enrollment, the app loads the course, group, and mentor.
4. The UI shows enrollment cards.

## Student Profile

Primary file:

- `app/student/profile/page.tsx`

The profile view is read-only and displays the current student's name, last name, email, and phone.

## Mentor Dashboard

Primary files:

- `app/mentor/page.tsx`
- `app/mentor/mentor-dashboard.tsx`
- `app/mentor/_data/workspace.ts`

Flow:

1. `useRequiredProfile("mentor")` verifies the current user and mentor profile.
2. `getMentorGroupWorkspaces(user.uid)` loads groups where `mentorId == user.uid`.
3. For each group, the app loads the course, lessons, assigned enrollments, student profiles, and attendance records.
4. The UI shows assigned groups and a selected group workspace.

## Mentor Attendance Toggle

Primary files:

- `app/mentor/mentor-dashboard.tsx`
- `app/mentor/_data/attendance.ts`
- `app/_data/attendance.repository.ts`

Flow:

1. Mentor toggles attendance for a student and lesson.
2. Client verifies the selected group belongs to the mentor, the student is assigned, and the lesson belongs to the group.
3. If an attendance record exists, the app deletes it.
4. If no attendance record exists, the app creates `Attendances/{studentId}_{lessonId}`.
5. Firestore rules also validate assigned mentor and active enrollment.

## Super-Admin Dashboard

Primary files:

- `app/super-admin/page.tsx`
- `app/super-admin/super-admin-dashboard.tsx`
- `app/super-admin/_data/students.ts`
- `app/super-admin/_data/mentors.ts`

Flow:

1. `useRequiredProfile("super-admin")` verifies the current user and super-admin profile.
2. Dashboard lists student and mentor profiles.
3. Super-admin can create student and mentor Auth accounts plus profile documents.
4. Super-admin can remove profile documents from portal access.

Current delete behavior removes the Firestore profile document. The confirmation copy states that the Firebase Auth account remains until deleted from a trusted admin backend.
