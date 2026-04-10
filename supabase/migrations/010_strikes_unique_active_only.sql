-- Migration 010: Fix unique strikes index to only apply to ACTIVE strikes
-- The previous index (009) was too broad: it blocked recreation of annulled strikes.
-- A student can have an annulled strike + a new active one for the same task (e.g. after EVA).

DROP INDEX IF EXISTS idx_strikes_unique_cw;

-- Only one ACTIVE strike per (course, student, bimestre, cwId, reason)
CREATE UNIQUE INDEX idx_strikes_unique_active_cw
ON strikes(course_id, student_email, bimestre, classroom_coursework_id, reason)
WHERE classroom_coursework_id IS NOT NULL AND active = true;
