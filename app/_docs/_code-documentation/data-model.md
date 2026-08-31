# Data Model

Canonical tables:

- `profiles`
- `students`
- `mentors`
- `super_admins`
- `courses`
- `course_mentor_eligibility`
- `groups`
- `lessons`
- `enrollments`
- `attendances`

Important rules:

- `profiles.id` references `auth.users.id`.
- Course mentor eligibility is a join table.
<<<<<<< HEAD
- Super-admin mentor course toggles write `course_mentor_eligibility` rows.
- Mentors can see active unassigned enrollments for eligible courses and create
  groups through a mentor-authenticated server action.
=======
- Courses can expose an optional public `price`.
>>>>>>> b4c7db1 (feat: add price field to courses and update related documentation and UI)
- Enrollments allow pending group assignment with null `group_id` and
  `mentor_id`.
- Students can create only their own active pending enrollments for active
  courses. Super-admins manage enrollment assignment details.
- Attendance is boolean: an `attendances` row means attended.
- Important records use soft deletes through `deleted_at`.
- Payment tables and private-student tables are deferred.
