-- Run this in your Supabase SQL Editor to update your existing tables

-- 1. Add team_unique_id to registrations table if it's missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registrations' AND column_name = 'team_unique_id') THEN
        ALTER TABLE registrations ADD COLUMN team_unique_id text unique;
    END IF;
END $$;

-- 2. Add email to team_members table if it's missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'email') THEN
        ALTER TABLE team_members ADD COLUMN email text;
    END IF;
END $$;
