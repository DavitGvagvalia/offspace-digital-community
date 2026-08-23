# Super-Admin Flow

Super-admins sign in at `/super-admin/login`.

Super-admins can:

- Create student accounts.
- Create mentor accounts.
- Open mentor details and select courses that mentor can teach.
- View student and mentor profile details.
- Soft-delete portal access.
- Manage the setup data needed by the MVP.

Student self-registration is also available from `/student/register`. The first
super-admin must be created manually in Supabase before the portal can manage
other accounts.
