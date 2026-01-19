-- Create tickets table
CREATE TABLE tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    ticket_type TEXT DEFAULT 'star_night_pass',
    price DECIMAL(10, 2) DEFAULT 499.00,
    payment_status TEXT DEFAULT 'pending', -- pending, confirmed, failed
    tiqr_booking_uid TEXT UNIQUE,
    tiqr_booking_id TEXT,
    qr_code_url TEXT
);

-- Indexes
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_tiqr_uid ON tickets(tiqr_booking_uid);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policies for Users
CREATE POLICY "Users can create their own tickets" 
ON tickets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tickets" 
ON tickets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" 
ON tickets FOR UPDATE 
USING (auth.uid() = user_id);

-- Policies for Admin (prakrida@bitmesra.ac.in)
CREATE POLICY "Admin can view all tickets" 
ON tickets FOR SELECT 
USING (auth.jwt() ->> 'email' = 'prakrida@bitmesra.ac.in');

CREATE POLICY "Admin can update all tickets" 
ON tickets FOR UPDATE 
USING (auth.jwt() ->> 'email' = 'prakrida@bitmesra.ac.in');
