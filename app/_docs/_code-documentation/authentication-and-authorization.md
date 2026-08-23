# Authentication And Authorization

Authentication uses Supabase Auth email/password.

Portal access is checked by the authenticated user's `auth.users.id` and rows in
Postgres:

- Student: `profiles.role = 'student'` plus `students.user_id`.
- Mentor: `profiles.role = 'mentor'` plus `mentors.user_id`.
- Super-admin: `profiles.role = 'super_admin'` plus `super_admins.user_id`.

Normal browser reads and writes are constrained by Row Level Security.
Student self-registration and super-admin student/mentor account creation run
through server actions using `SUPABASE_SECRET_KEY`.

Students may insert only their own active, unassigned enrollments for active
<<<<<<< HEAD
<<<<<<< HEAD
courses. The app uses a student-authenticated server action for student course
selection, and super-admins retain full enrollment management access.
=======
courses. Super-admins retain full enrollment management access.
>>>>>>> 1f8509b (feat: implement student self-registration and update related documentation)
=======
courses. The app uses a student-authenticated server action for student course
selection, and super-admins retain full enrollment management access.
>>>>>>> d4a4744 (feat: enhance student enrollment process with server actions and improve documentation)

The first super-admin is bootstrapped manually in Supabase Dashboard and SQL.
