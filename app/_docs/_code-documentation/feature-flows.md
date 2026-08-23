# Feature Flows

## Login

Role login pages sign in with Supabase Auth and verify a matching profile/role
row before routing into the portal.

## Student

Students can view profile data, enrollments, courses, assigned lessons, and
personal attendance. Pending group assignment displays
`Your mentor will assign group soon.`

## Mentor

Mentors load groups where `groups.mentor_id` is the authenticated user. They can
mark attendance only for students and lessons in assigned groups.

## Super-Admin

Super-admins create student and mentor Supabase Auth users through server
actions and manage MVP setup data.
