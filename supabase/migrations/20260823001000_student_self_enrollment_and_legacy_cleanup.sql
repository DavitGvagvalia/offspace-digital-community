alter table if exists public.profiles
  drop column if exists legacy_firebase_uid;

alter table if exists public.courses
  drop column if exists legacy_firebase_id;

alter table if exists public.groups
  drop column if exists legacy_firebase_id;

alter table if exists public.lessons
  drop column if exists legacy_firebase_id;

alter table if exists public.enrollments
  drop column if exists legacy_firebase_id;

alter table if exists public.attendances
  drop column if exists legacy_firebase_id;

drop policy if exists "enrollments_insert_student_self" on public.enrollments;

create policy "enrollments_insert_student_self"
on public.enrollments for insert
with check (
  student_id = auth.uid()
  and group_id is null
  and mentor_id is null
  and price is null
  and completed_at is null
  and status = 'active'
  and deleted_at is null
  and exists (
    select 1
    from public.profiles p
    join public.students s on s.user_id = p.id
    where p.id = auth.uid()
      and p.role = 'student'
      and p.deleted_at is null
      and s.deleted_at is null
  )
  and exists (
    select 1
    from public.courses c
    where c.id = enrollments.course_id
      and c.active = true
      and c.deleted_at is null
  )
);
