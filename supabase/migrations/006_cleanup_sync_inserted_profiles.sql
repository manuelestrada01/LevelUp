-- Remove student_profiles rows that were incorrectly inserted by the sync engine
-- (students who never logged in and never chose a formative class).
-- These rows have formative_class = 'erudito' as a default but were never set by the student.
-- The dashboard falls back to 'erudito' display when no profile exists, so deleting is safe.
DELETE FROM student_profiles
WHERE formative_class = 'erudito'
  AND display_name IS NOT NULL;
