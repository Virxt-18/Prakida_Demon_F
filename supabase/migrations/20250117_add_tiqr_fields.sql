-- Add TiQR integration fields to registrations table
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS tiqr_booking_uid TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS tiqr_booking_id TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'; -- pending, confirmed, failed
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS ticket_pdf_url TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS created_via_tiqr BOOLEAN DEFAULT false;

-- Add index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_registrations_tiqr_uid ON registrations(tiqr_booking_uid);
