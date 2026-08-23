# Authentication And Authorization

Authentication uses Supabase Auth email/password.

Portal access is checked by the authenticated user's `auth.users.id` and rows in
Postgres:

- Student: `profiles.role = 'student'` plus `students.user_id`.
- Mentor: `profiles.role = 'mentor'` plus `mentors.user_id`.
- Super-admin: `profiles.role = 'super_admin'` plus `super_admins.user_id`.

Normal browser reads and writes are constrained by Row Level Security.
Super-admin student/mentor account creation runs through server actions using
`SUPABASE_SECRET_KEY`.

The first super-admin is bootstrapped manually in Supabase Dashboard and SQL.
