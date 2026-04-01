-- Panel de Acciones: grupos de acciones docentes sobre múltiples alumnos
CREATE TABLE IF NOT EXISTS teacher_action_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  type text NOT NULL,         -- strike_force | strike_annul | unlock | xp_event | xp_quality | xp_extraordinary | talent
  subtype text,               -- reserved for future subtypes
  title text NOT NULL,        -- label visible en la UI
  description text,
  xp_value int,               -- para xp_event
  talent_slug text,           -- para type = talent
  affected_emails text[] NOT NULL DEFAULT '{}',
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tag_course_id ON teacher_action_groups(course_id);
CREATE INDEX IF NOT EXISTS idx_tag_created_at ON teacher_action_groups(created_at DESC);
