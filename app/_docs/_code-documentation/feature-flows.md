# Feature Flows

## Login

Role login pages sign in with Supabase Auth and verify a matching profile/role
row before routing into the portal.

## Student

Students can self-register, view profile data, enrollments, courses, assigned
lessons, and personal attendance. If they have no enrollments, they can select
active courses from the student hub. Pending group assignment displays
`Your mentor will assign group soon.`

## Mentor

Mentors load groups where `groups.mentor_id` is the authenticated user. They can
create groups for courses they are eligible to teach, see active unassigned
enrollments for those courses, assign selected pending students while creating a
group, and mark attendance only for students and lessons in assigned groups.

## Super-Admin

Super-admins create mentor Supabase Auth users and can create managed student
users through server actions. They manage MVP setup data and can open a mentor
details modal to select the courses that mentor can teach.
