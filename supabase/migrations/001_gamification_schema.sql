-- LevelUp: Visor Académico Gamificado
-- Migration 001: Full gamification schema
-- Run this in the Supabase SQL Editor

-- ============================================================
-- UPDATE existing student_profiles table
-- ============================================================
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS display_name text;

-- ============================================================
-- TABLE: courses
-- Classroom courses registered by teachers
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id    text UNIQUE NOT NULL,
  teacher_email   text NOT NULL,
  name            text NOT NULL,
  section         text,
  year            int NOT NULL,
  bimestre_activo text NOT NULL DEFAULT 'B1',
  active          bool NOT NULL DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_email);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);

-- ============================================================
-- TABLE: coursework_config
-- Teacher maps each Classroom assignment to a production type
-- ============================================================
CREATE TABLE IF NOT EXISTS coursework_config (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id               uuid REFERENCES courses(id) ON DELETE CASCADE,
  classroom_coursework_id text NOT NULL,
  tipo                    text NOT NULL,
  name                    text NOT NULL,
  UNIQUE(course_id, classroom_coursework_id)
);

CREATE INDEX IF NOT EXISTS idx_cwconfig_course ON coursework_config(course_id);

-- ============================================================
-- TABLE: deliveries
-- Submissions synced from Classroom and computed
-- ============================================================
CREATE TABLE IF NOT EXISTS deliveries (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id               uuid REFERENCES courses(id) ON DELETE CASCADE,
  student_email           text NOT NULL,
  classroom_coursework_id text NOT NULL,
  bimestre                text NOT NULL,
  tipo                    text NOT NULL,
  submitted_at            timestamptz,
  due_at                  timestamptz,
  is_early                bool NOT NULL DEFAULT false,
  status                  text NOT NULL CHECK (status IN ('OK', 'LATE', 'MISSING')),
  xp_base                 int NOT NULL DEFAULT 0,
  xp_bonus                int NOT NULL DEFAULT 0,
  synced_at               timestamptz DEFAULT now(),
  UNIQUE(course_id, student_email, classroom_coursework_id)
);

CREATE INDEX IF NOT EXISTS idx_deliveries_student ON deliveries(student_email);
CREATE INDEX IF NOT EXISTS idx_deliveries_course_bimestre ON deliveries(course_id, bimestre);

-- ============================================================
-- TABLE: strikes
-- Academic strikes per student (never expire, manually annulled)
-- ============================================================
CREATE TABLE IF NOT EXISTS strikes (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id               uuid REFERENCES courses(id) ON DELETE CASCADE,
  student_email           text NOT NULL,
  bimestre                text NOT NULL,
  reason                  text NOT NULL CHECK (reason IN ('no_submission', 'late_submission', 'missing_material')),
  classroom_coursework_id text,
  active                  bool NOT NULL DEFAULT true,
  created_at              timestamptz DEFAULT now(),
  annulled_at             timestamptz,
  annulled_by             text
);

CREATE INDEX IF NOT EXISTS idx_strikes_student ON strikes(student_email, course_id, bimestre);
CREATE INDEX IF NOT EXISTS idx_strikes_active ON strikes(active);

-- ============================================================
-- TABLE: student_game_state
-- Computed & cached game state per student/course/bimestre
-- ============================================================
CREATE TABLE IF NOT EXISTS student_game_state (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       uuid REFERENCES courses(id) ON DELETE CASCADE,
  student_email   text NOT NULL,
  bimestre        text NOT NULL,
  xp_total        int NOT NULL DEFAULT 0,
  level           int NOT NULL DEFAULT 1,
  strikes_active  int NOT NULL DEFAULT 0,
  blocked         bool NOT NULL DEFAULT false,
  blocked_at      timestamptz,
  updated_at      timestamptz DEFAULT now(),
  UNIQUE(course_id, student_email, bimestre)
);

CREATE INDEX IF NOT EXISTS idx_game_state_student ON student_game_state(student_email);
CREATE INDEX IF NOT EXISTS idx_game_state_course ON student_game_state(course_id, bimestre);

-- ============================================================
-- TABLE: talent_grants
-- Talents manually granted by teachers
-- ============================================================
CREATE TABLE IF NOT EXISTS talent_grants (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     uuid REFERENCES courses(id) ON DELETE CASCADE,
  student_email text NOT NULL,
  talent_id     text NOT NULL,
  granted_by    text NOT NULL,
  granted_at    timestamptz DEFAULT now(),
  UNIQUE(course_id, student_email, talent_id)
);

CREATE INDEX IF NOT EXISTS idx_talents_student ON talent_grants(student_email, course_id);

-- ============================================================
-- TABLE: distinction_grants
-- Distinctions/badges granted by teachers
-- ============================================================
CREATE TABLE IF NOT EXISTS distinction_grants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       uuid REFERENCES courses(id) ON DELETE CASCADE,
  student_email   text NOT NULL,
  distinction_id  text NOT NULL,
  granted_by      text NOT NULL,
  granted_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_distinctions_student ON distinction_grants(student_email, course_id);

-- ============================================================
-- TABLE: teacher_exceptions
-- Teacher overrides with full audit trail
-- ============================================================
CREATE TABLE IF NOT EXISTS teacher_exceptions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     uuid REFERENCES courses(id) ON DELETE CASCADE,
  student_email text NOT NULL,
  type          text NOT NULL CHECK (type IN ('force_unlock', 'annul_strike', 'enable_recovery', 'manual_xp')),
  notes         text,
  value         int,
  created_by    text NOT NULL,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exceptions_student ON teacher_exceptions(student_email, course_id);
