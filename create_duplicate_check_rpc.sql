-- Create a secure function to check for duplicates
-- This runs as 'security definer' (admin privileges) to check ALL records
-- regardless of RLS, but only returns the conflicting emails (privacy safe).

create or replace function check_duplicates(
  _emails text[],
  _sport text,
  _category text
)
returns text[]
language plpgsql
security definer
as $$
declare
  duplicates text[];
begin
  select array_agg(distinct tm.email)
  into duplicates
  from team_members tm
  inner join registrations r on tm.registration_id = r.id
  where tm.email = any(_emails)
  and r.sport = _sport
  and r.category = _category;

  return coalesce(duplicates, '{}');
end;
$$;
