create or replace function public.get_my_enrollment_mentors()
returns table (
  mentor_id uuid,
  name text,
  last_name text
)
language sql
security definer
set search_path = ''
stable
as $$
  select distinct
    profiles.id as mentor_id,
    profiles.name,
    profiles.last_name
  from public.enrollments
  join public.profiles
    on profiles.id = enrollments.mentor_id
  where enrollments.student_id = (select auth.uid())
    and exists (
      select 1
      from public.students
      where students.user_id = (select auth.uid())
        and students.deleted_at is null
    )
    and enrollments.deleted_at is null
    and enrollments.mentor_id is not null
    and profiles.role = 'mentor'
    and profiles.deleted_at is null;
$$;

revoke all on function public.get_my_enrollment_mentors() from public;
revoke all on function public.get_my_enrollment_mentors() from anon;
revoke all on function public.get_my_enrollment_mentors() from authenticated;
grant execute on function public.get_my_enrollment_mentors() to authenticated;
