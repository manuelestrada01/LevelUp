-- Add PENDING to deliveries.status allowed values
-- PENDING = task assigned but deadline not yet reached, no submission yet

ALTER TABLE deliveries
  DROP CONSTRAINT IF EXISTS deliveries_status_check;

ALTER TABLE deliveries
  ADD CONSTRAINT deliveries_status_check
  CHECK (status IN ('OK', 'LATE', 'MISSING', 'PENDING'));

-- Update existing MISSING deliveries that haven't reached their deadline yet
UPDATE deliveries
SET status = 'PENDING'
WHERE status = 'MISSING'
  AND due_at IS NOT NULL
  AND due_at > NOW()
  AND submitted_at IS NULL;
