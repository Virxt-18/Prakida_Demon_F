-- Add user_email column to tickets table
ALTER TABLE tickets 
ADD COLUMN user_email TEXT;

-- Optional: Update existing tickets (if any) with a placeholder or leave null
-- Since we just started, it's fine.
