-- Template for relational sample data after real Supabase Auth users exist.
--
-- Replace the ids below with existing auth user ids:
-- - <mentor-auth-user-id> must exist in public.profiles and public.mentors.
-- - <student-auth-user-id> must exist in public.profiles and public.students.
--
-- This file is a template, not an automatic seed. Do not run it until the
-- placeholder ids are replaced.

begin;

with selected_course as (
  select id
  from public.courses
  where id = '00000000-0000-4000-8000-000000000101'::uuid
    and deleted_at is null
  limit 1
),
eligible_mentor as (
  insert into public.course_mentor_eligibility (course_id, mentor_id)
  select selected_course.id, '<mentor-auth-user-id>'::uuid
  from selected_course
  on conflict (course_id, mentor_id) do update
  set deleted_at = null
  returning course_id, mentor_id
),
created_group as (
  insert into public.groups (
    id,
    course_id,
    mentor_id,
    name,
    active
  )
  select
    '00000000-0000-4000-8000-000000000201',
    eligible_mentor.course_id,
    eligible_mentor.mentor_id,
    'Frontend A',
    true
  from eligible_mentor
  on conflict (id) do update
  set
    course_id = excluded.course_id,
    mentor_id = excluded.mentor_id,
    name = excluded.name,
    active = excluded.active,
    updated_at = now(),
    deleted_at = null
  returning id, course_id, mentor_id
),
created_enrollment as (
  insert into public.enrollments (
    student_id,
    course_id,
    group_id,
    mentor_id,
    status
  )
  select
    '<student-auth-user-id>'::uuid,
    created_group.course_id,
    created_group.id,
    created_group.mentor_id,
    'active'
  from created_group
  on conflict (student_id, course_id) do update
  set
    group_id = excluded.group_id,
    mentor_id = excluded.mentor_id,
    status = excluded.status,
    updated_at = now(),
    deleted_at = null
  returning course_id, group_id
),
created_lessons as (
  insert into public.lessons (
    id,
    course_id,
    group_id,
    title,
    description,
    lesson_at
  )
  select
    lesson.id,
    created_enrollment.course_id,
    created_enrollment.group_id,
    lesson.title,
    lesson.description,
    lesson.lesson_at
  from created_enrollment
  cross join (
    values
      (
        '00000000-0000-4000-8000-000000000401'::uuid,
        'HTML structure and semantic pages',
        'Build the base structure for a readable web page.',
        now() - interval '14 days'
      ),
      (
        '00000000-0000-4000-8000-000000000402'::uuid,
        'CSS layout fundamentals',
        'Practice spacing, responsive layout, and reusable UI sections.',
        now() - interval '7 days'
      ),
      (
        '00000000-0000-4000-8000-000000000403'::uuid,
        'React components and state',
        'Create small components and connect interaction state.',
        now() - interval '1 day'
      )
  ) as lesson(id, title, description, lesson_at)
  on conflict (id) do update
  set
    course_id = excluded.course_id,
    group_id = excluded.group_id,
    title = excluded.title,
    description = excluded.description,
    lesson_at = excluded.lesson_at,
    updated_at = now(),
    deleted_at = null
  returning id, course_id, group_id
)
insert into public.attendances (
  student_id,
  course_id,
  group_id,
  lesson_id,
  attended_at
)
select
  '<student-auth-user-id>'::uuid,
  created_lessons.course_id,
  created_lessons.group_id,
  created_lessons.id,
  now()
from created_lessons
on conflict (student_id, lesson_id) do update
set
  attended_at = excluded.attended_at,
  deleted_at = null;

commit;
