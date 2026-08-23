create extension if not exists pgcrypto;

do $$
begin
  create type public.portal_role as enum ('student', 'mentor', 'super_admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.enrollment_status as enum (
    'active',
    'paused',
    'completed',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.portal_role not null,
  name text not null,
  last_name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.students (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.mentors (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.super_admins (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.course_mentor_eligibility (
  course_id uuid not null references public.courses(id) on delete cascade,
  mentor_id uuid not null references public.mentors(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  primary key (course_id, mentor_id)
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  mentor_id uuid not null references public.mentors(user_id),
  name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  title text,
  description text,
  lesson_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  group_id uuid references public.groups(id),
  mentor_id uuid references public.mentors(user_id),
  price numeric(12, 2),
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz,
  deleted_at timestamptz,
  unique (student_id, course_id),
  check (
    (group_id is null and mentor_id is null)
    or
    (group_id is not null and mentor_id is not null)
  )
);

create table if not exists public.attendances (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  attended_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (student_id, lesson_id)
);

create index if not exists profiles_role_idx on public.profiles (role)
where deleted_at is null;
create index if not exists groups_mentor_id_idx on public.groups (mentor_id)
where deleted_at is null;
create index if not exists lessons_group_lesson_at_idx on public.lessons (group_id, lesson_at)
where deleted_at is null;
create index if not exists enrollments_student_id_idx on public.enrollments (student_id)
where deleted_at is null;
create index if not exists enrollments_mentor_group_idx on public.enrollments (mentor_id, group_id)
where deleted_at is null;
create index if not exists attendances_student_group_idx on public.attendances (student_id, group_id)
where deleted_at is null;
create index if not exists attendances_group_idx on public.attendances (group_id)
where deleted_at is null;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    join public.super_admins s on s.user_id = p.id
    where p.id = auth.uid()
      and p.role = 'super_admin'
      and p.deleted_at is null
      and s.deleted_at is null
  );
$$;

create or replace function public.is_group_mentor(target_group_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.groups g
    where g.id = target_group_id
      and g.mentor_id = auth.uid()
      and g.deleted_at is null
  );
$$;

create or replace function public.is_student_assigned_to_group(
  target_student_id uuid,
  target_group_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.enrollments e
    where e.student_id = target_student_id
      and e.group_id = target_group_id
      and e.status = 'active'
      and e.deleted_at is null
  );
$$;

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.mentors enable row level security;
alter table public.super_admins enable row level security;
alter table public.courses enable row level security;
alter table public.course_mentor_eligibility enable row level security;
alter table public.groups enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.attendances enable row level security;

create policy "profiles_select_assigned"
on public.profiles for select
using (
  deleted_at is null
  and (
    id = auth.uid()
    or public.is_super_admin()
    or exists (
      select 1
      from public.enrollments e
      where e.student_id = profiles.id
        and e.mentor_id = auth.uid()
        and e.deleted_at is null
    )
  )
);

create policy "profiles_select_eligible_unassigned_mentor"
on public.profiles for select
using (
  deleted_at is null
  and exists (
    select 1
    from public.enrollments e
    join public.course_mentor_eligibility cme
      on cme.course_id = e.course_id
    join public.mentors m
      on m.user_id = cme.mentor_id
    where e.student_id = profiles.id
      and e.group_id is null
      and e.mentor_id is null
      and e.status = 'active'
      and e.deleted_at is null
      and cme.mentor_id = auth.uid()
      and cme.deleted_at is null
      and m.deleted_at is null
  )
);

create policy "profiles_insert_super_admin"
on public.profiles for insert
with check (public.is_super_admin());

create policy "profiles_update_super_admin"
on public.profiles for update
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "students_select_assigned"
on public.students for select
using (
  deleted_at is null
  and (
    user_id = auth.uid()
    or public.is_super_admin()
    or exists (
      select 1
      from public.enrollments e
      where e.student_id = students.user_id
        and e.mentor_id = auth.uid()
        and e.deleted_at is null
    )
  )
);

create policy "students_write_super_admin"
on public.students for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "mentors_select_portal"
on public.mentors for select
using (
  deleted_at is null
  and (
    user_id = auth.uid()
    or public.is_super_admin()
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.deleted_at is null
    )
  )
);

create policy "mentors_write_super_admin"
on public.mentors for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "super_admins_select_self"
on public.super_admins for select
using (
  deleted_at is null
  and (user_id = auth.uid() or public.is_super_admin())
);

create policy "super_admins_write_super_admin"
on public.super_admins for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "courses_select_portal"
on public.courses for select
using (
  deleted_at is null
  and auth.uid() is not null
  and (
    active = true
    or public.is_super_admin()
    or exists (
      select 1
      from public.mentors m
      where m.user_id = auth.uid()
        and m.deleted_at is null
    )
    or exists (
      select 1
      from public.enrollments e
      where e.course_id = courses.id
        and e.student_id = auth.uid()
        and e.deleted_at is null
    )
  )
);

create policy "courses_write_super_admin"
on public.courses for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "course_mentor_eligibility_select_portal"
on public.course_mentor_eligibility for select
using (
  deleted_at is null
  and (
    public.is_super_admin()
    or mentor_id = auth.uid()
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.deleted_at is null
    )
  )
);

create policy "course_mentor_eligibility_write_super_admin"
on public.course_mentor_eligibility for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "groups_select_assigned"
on public.groups for select
using (
  deleted_at is null
  and (
    public.is_super_admin()
    or mentor_id = auth.uid()
    or public.is_student_assigned_to_group(auth.uid(), id)
  )
);

create policy "groups_write_super_admin"
on public.groups for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "lessons_select_assigned"
on public.lessons for select
using (
  deleted_at is null
  and (
    public.is_super_admin()
    or public.is_group_mentor(group_id)
    or public.is_student_assigned_to_group(auth.uid(), group_id)
  )
);

create policy "lessons_write_group_mentor_or_super_admin"
on public.lessons for all
using (public.is_super_admin() or public.is_group_mentor(group_id))
with check (public.is_super_admin() or public.is_group_mentor(group_id));

create policy "enrollments_select_assigned"
on public.enrollments for select
using (
  deleted_at is null
  and (
    student_id = auth.uid()
    or mentor_id = auth.uid()
    or public.is_super_admin()
  )
);

create policy "enrollments_select_eligible_unassigned_mentor"
on public.enrollments for select
using (
  deleted_at is null
  and group_id is null
  and mentor_id is null
  and status = 'active'
  and exists (
    select 1
    from public.course_mentor_eligibility cme
    join public.mentors m
      on m.user_id = cme.mentor_id
    where cme.course_id = enrollments.course_id
      and cme.mentor_id = auth.uid()
      and cme.deleted_at is null
      and m.deleted_at is null
  )
);

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

create policy "enrollments_write_super_admin"
on public.enrollments for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "attendances_select_assigned"
on public.attendances for select
using (
  deleted_at is null
  and (
    student_id = auth.uid()
    or public.is_group_mentor(group_id)
    or public.is_super_admin()
  )
);

create policy "attendances_insert_group_mentor"
on public.attendances for insert
with check (
  public.is_super_admin()
  or (
    public.is_group_mentor(group_id)
    and public.is_student_assigned_to_group(student_id, group_id)
  )
);

create policy "attendances_update_group_mentor"
on public.attendances for update
using (
  public.is_super_admin()
  or (
    public.is_group_mentor(group_id)
    and public.is_student_assigned_to_group(student_id, group_id)
  )
)
with check (
  public.is_super_admin()
  or (
    public.is_group_mentor(group_id)
    and public.is_student_assigned_to_group(student_id, group_id)
  )
);

create policy "attendances_delete_group_mentor"
on public.attendances for delete
using (
  public.is_super_admin()
  or (
    public.is_group_mentor(group_id)
    and public.is_student_assigned_to_group(student_id, group_id)
  )
);
