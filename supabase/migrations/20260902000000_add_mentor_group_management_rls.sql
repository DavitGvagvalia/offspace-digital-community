create or replace function public.is_active_mentor(target_mentor_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.mentors
    where mentors.user_id = target_mentor_id
      and mentors.active is true
      and mentors.deleted_at is null
  );
$$;

create or replace function public.is_course_mentor(
  target_course_id uuid,
  target_mentor_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_mentor(target_mentor_id)
    and exists (
      select 1
      from public.course_mentor_eligibility
      where course_mentor_eligibility.course_id = target_course_id
        and course_mentor_eligibility.mentor_id = target_mentor_id
        and course_mentor_eligibility.deleted_at is null
    );
$$;

create or replace function public.mentor_owns_group(
  target_group_id uuid,
  target_mentor_id uuid,
  target_course_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.groups
    where groups.id = target_group_id
      and groups.mentor_id = target_mentor_id
      and groups.course_id = target_course_id
      and groups.deleted_at is null
  );
$$;

revoke all on function public.is_active_mentor(uuid) from public;
revoke all on function public.is_course_mentor(uuid, uuid) from public;
revoke all on function public.mentor_owns_group(uuid, uuid, uuid) from public;
grant execute on function public.is_active_mentor(uuid) to authenticated;
grant execute on function public.is_course_mentor(uuid, uuid) to authenticated;
grant execute on function public.mentor_owns_group(uuid, uuid, uuid) to authenticated;

alter table public.courses enable row level security;
alter table public.course_mentor_eligibility enable row level security;
alter table public.groups enable row level security;
alter table public.enrollments enable row level security;
alter table public.profiles enable row level security;

grant select on public.courses to authenticated;
grant select on public.course_mentor_eligibility to authenticated;
grant select, insert, update on public.groups to authenticated;
grant select on public.profiles to authenticated;
grant select on public.enrollments to authenticated;
grant update (group_id, mentor_id, updated_at) on public.enrollments to authenticated;

drop policy if exists "Mentors can view eligible courses" on public.courses;
create policy "Mentors can view eligible courses"
on public.courses
for select
to authenticated
using (
  active is true
  and deleted_at is null
  and public.is_course_mentor(id, (select auth.uid()))
);

drop policy if exists "Mentors can view own course eligibility" on public.course_mentor_eligibility;
create policy "Mentors can view own course eligibility"
on public.course_mentor_eligibility
for select
to authenticated
using (
  mentor_id = (select auth.uid())
  and deleted_at is null
  and public.is_active_mentor((select auth.uid()))
);

drop policy if exists "Mentors can view own groups" on public.groups;
create policy "Mentors can view own groups"
on public.groups
for select
to authenticated
using (
  mentor_id = (select auth.uid())
  and deleted_at is null
  and public.is_active_mentor((select auth.uid()))
);

drop policy if exists "Mentors can create eligible own groups" on public.groups;
create policy "Mentors can create eligible own groups"
on public.groups
for insert
to authenticated
with check (
  mentor_id = (select auth.uid())
  and deleted_at is null
  and public.is_course_mentor(course_id, (select auth.uid()))
);

drop policy if exists "Mentors can update own groups" on public.groups;
create policy "Mentors can update own groups"
on public.groups
for update
to authenticated
using (
  mentor_id = (select auth.uid())
  and deleted_at is null
  and public.is_active_mentor((select auth.uid()))
)
with check (
  mentor_id = (select auth.uid())
  and deleted_at is null
  and public.is_course_mentor(course_id, (select auth.uid()))
);

drop policy if exists "Mentors can view group management enrollments" on public.enrollments;
create policy "Mentors can view group management enrollments"
on public.enrollments
for select
to authenticated
using (
  deleted_at is null
  and (
    (
      status = 'active'
      and group_id is null
      and mentor_id is null
      and public.is_course_mentor(course_id, (select auth.uid()))
    )
    or (
      group_id is not null
      and mentor_id = (select auth.uid())
      and public.mentor_owns_group(group_id, (select auth.uid()), course_id)
    )
  )
);

drop policy if exists "Mentors can assign eligible enrollments" on public.enrollments;
create policy "Mentors can assign eligible enrollments"
on public.enrollments
for update
to authenticated
using (
  deleted_at is null
  and (
    (
      status = 'active'
      and group_id is null
      and mentor_id is null
      and public.is_course_mentor(course_id, (select auth.uid()))
    )
    or (
      group_id is not null
      and mentor_id = (select auth.uid())
      and public.mentor_owns_group(group_id, (select auth.uid()), course_id)
    )
  )
)
with check (
  deleted_at is null
  and (
    (
      status = 'active'
      and group_id is null
      and mentor_id is null
      and public.is_course_mentor(course_id, (select auth.uid()))
    )
    or (
      group_id is not null
      and mentor_id = (select auth.uid())
      and public.mentor_owns_group(group_id, (select auth.uid()), course_id)
    )
  )
);

drop policy if exists "Mentors can view assignable student profiles" on public.profiles;
create policy "Mentors can view assignable student profiles"
on public.profiles
for select
to authenticated
using (
  role = 'student'
  and deleted_at is null
  and exists (
    select 1
    from public.enrollments
    where enrollments.student_id = profiles.id
      and enrollments.deleted_at is null
      and (
        (
          enrollments.status = 'active'
          and enrollments.group_id is null
          and enrollments.mentor_id is null
          and public.is_course_mentor(enrollments.course_id, (select auth.uid()))
        )
        or (
          enrollments.group_id is not null
          and enrollments.mentor_id = (select auth.uid())
          and public.mentor_owns_group(
            enrollments.group_id,
            (select auth.uid()),
            enrollments.course_id
          )
        )
      )
  )
);
