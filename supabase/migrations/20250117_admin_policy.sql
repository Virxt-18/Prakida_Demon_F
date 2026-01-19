-- Admin Policy
-- Allow specific admin email to SELECT and UPDATE all registrations

-- 1. Create Policy for SELECT (View all data)
CREATE POLICY "Admin can view all registrations" 
ON registrations 
FOR SELECT 
USING (auth.jwt() ->> 'email' = 'prakrida@bitmesra.ac.in');

-- 2. Create Policy for UPDATE (Mark as Paid)
CREATE POLICY "Admin can update all registrations" 
ON registrations 
FOR UPDATE 
USING (auth.jwt() ->> 'email' = 'prakrida@bitmesra.ac.in');
