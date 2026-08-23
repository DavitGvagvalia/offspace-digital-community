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
- Super-admin mentor course toggles write `course_mentor_eligibility` rows.
- Enrollments allow pending group assignment with null `group_id` and
  `mentor_id`.
- Students can create only their own active pending enrollments for active
  courses. Super-admins manage enrollment assignment details.
- Attendance is boolean: an `attendances` row means attended.
- Important records use soft deletes through `deleted_at`.
- Payment tables and private-student tables are deferred.
