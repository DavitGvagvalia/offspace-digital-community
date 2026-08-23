drop policy if exists "profiles_select_eligible_unassigned_mentor"
on public.profiles;

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

drop policy if exists "enrollments_select_eligible_unassigned_mentor"
on public.enrollments;

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
