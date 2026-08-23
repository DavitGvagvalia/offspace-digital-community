-- Base reference data for the hosted Supabase MVP.
--
-- This file is safe to run more than once. It does not create Supabase Auth
-- users. Create students, mentors, and the first super-admin through Supabase
-- Auth / the app's super-admin flow, then use the template file for connected
-- group, lesson, and enrollment rows.

insert into public.courses (id, name, description, active)
values
  (
    '00000000-0000-4000-8000-000000000101',
    'Frontend Development',
    'HTML, CSS, JavaScript, React, and practical interface development.',
    true
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    'UI/UX Design',
    'Product thinking, interface design, prototyping, and usability basics.',
    true
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'Digital Marketing',
    'Content strategy, social channels, analytics, and campaign fundamentals.',
    true
  )
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  active = excluded.active,
  updated_at = now(),
  deleted_at = null;
