-- Migration 009: Prevent duplicate strikes per coursework per student
-- Remove existing duplicates keeping the oldest strike per (course, student, bimestre, cwId, reason)
DELETE FROM strikes
WHERE id NOT IN (
  SELECT DISTINCT ON (course_id, student_email, bimestre, classroom_coursework_id, reason) id
  FROM strikes
  WHERE classroom_coursework_id IS NOT NULL
  ORDER BY course_id, student_email, bimestre, classroom_coursework_id, reason, created_at
);

-- Unique index only when classroom_coursework_id is set (NULL rows are manual/teacher strikes, allowed to be multiple)
CREATE UNIQUE INDEX IF NOT EXISTS idx_strikes_unique_cw
ON strikes(course_id, student_email, bimestre, classroom_coursework_id, reason)
WHERE classroom_coursework_id IS NOT NULL;
