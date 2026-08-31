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
- Courses can expose an optional public `price`.
- Enrollments allow pending group assignment with null `group_id` and
  `mentor_id`.
- Attendance is boolean: an `attendances` row means attended.
- Important records use soft deletes through `deleted_at`.
- Payment tables and private-student tables are deferred.
