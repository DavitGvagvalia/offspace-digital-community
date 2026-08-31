alter table public.courses
  add column if not exists price numeric(10, 2);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'courses_price_non_negative'
  ) then
    alter table public.courses
      add constraint courses_price_non_negative
      check (price is null or price >= 0);
  end if;
end $$;
