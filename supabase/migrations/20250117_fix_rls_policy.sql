-- Enable RLS (just in case)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to update their OWN registrations
-- This is required for the Payment Integration to update fields like 'payment_status', 'tiqr_booking_uid'
CREATE POLICY "Users can update their own registrations" 
ON registrations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Also ensure Team Members policy exists if needed, but primarily the Creator (Captain) makes payment
-- If we want other members to pay, we'd need a policy joining team_members, but for now assuming Creator pays.
