-- 1. Allow users to view 'team_members' rows that match their logged-in email
create policy "Users can view memberships matching their email"
on team_members for select
using ( email = (auth.jwt() ->> 'email') );

-- 2. Allow users to view 'registrations' if they are listed as a team member
create policy "Users can view registrations they are part of"
on registrations for select
using (
  exists (
    select 1 from team_members
    where team_members.registration_id = registrations.id
    and team_members.email = (auth.jwt() ->> 'email')
  )
);
