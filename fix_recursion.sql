-- 1. Drop the problematic recursive policy
drop policy if exists "Users can view registrations they are part of" on registrations;

-- 2. Create a secure function to check membership (Bypasses RLS)
-- This function runs as the database owner, avoiding the infinite loop
create or replace function public.is_team_member(_registration_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from team_members
    where registration_id = _registration_id
    and email = (auth.jwt() ->> 'email')
  );
$$;

-- 3. Re-create the policy using the secure function
create policy "Users can view registrations they are part of"
on registrations for select
using (
  auth.uid() = user_id -- Creator can always view
  or
  public.is_team_member(id) -- Members can view (safe check)
);
