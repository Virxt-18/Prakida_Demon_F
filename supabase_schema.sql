-- Create Registrations Table
create table registrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  sport text not null,
  category text not null, -- e.g., 'men', 'women', 'mixed_double'
  team_name text not null,
  college text not null,
  contact_email text,
  contact_phone text,
  team_unique_id text unique, -- Added for unique team identifier (e.g., teamname@1234)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table registrations enable row level security;

-- Policies for Registrations
create policy "Users can view their own registrations"
  on registrations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own registrations"
  on registrations for insert
  with check (auth.uid() = user_id);

-- Create Team Members Table
create table team_members (
  id uuid default uuid_generate_v4() primary key,
  registration_id uuid references registrations not null on delete cascade,
  name text not null,
  role text default 'Player', -- 'Captain', 'Player', 'Manager'
  contact_info text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Team Members
alter table team_members enable row level security;

-- Policies for Team Members
create policy "Users can view members of their registrations"
  on team_members for select
  using (
    exists (
      select 1 from registrations
      where registrations.id = team_members.registration_id
      and registrations.user_id = auth.uid()
    )
  );

create policy "Users can insert members for their registrations"
  on team_members for insert
  with check (
    exists (
      select 1 from registrations
      where registrations.id = team_members.registration_id
      and registrations.user_id = auth.uid()
    )
  );
