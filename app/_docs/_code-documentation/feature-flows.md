# Feature Flows

## Login

Role login pages sign in with Supabase Auth and verify a matching profile/role
row before routing into the portal.

## Student

<<<<<<< HEAD
Students can self-register, view profile data, enrollments, courses, assigned
lessons, and personal attendance. If they have no enrollments, they can select
active courses from the student hub through a student-authenticated server
action. Pending group assignment displays `Your mentor will assign group soon.`
=======
Students can register at `/student/register`, then sign in at
`/student/login`. They can view profile data, enrollments, courses, assigned
lessons, and personal attendance. Pending group assignment displays
`Your mentor will assign group soon.`
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)

## Mentor

Mentors load groups where `groups.mentor_id` is the authenticated user. They can
create groups for courses they are eligible to teach, see active unassigned
enrollments for those courses, assign selected pending students while creating a
group, and mark attendance only for students and lessons in assigned groups.

## Super-Admin

<<<<<<< HEAD
Super-admins create mentor Supabase Auth users and can create managed student
users through server actions. They manage MVP setup data and can open a mentor
details modal to select the courses that mentor can teach.
=======
Super-admins create mentor Supabase Auth users through server actions and
manage MVP setup data. Student accounts can also be created through public
student registration.
>>>>>>> 4e832f9 (feat: implement public student registration functionality and update related documentation)
