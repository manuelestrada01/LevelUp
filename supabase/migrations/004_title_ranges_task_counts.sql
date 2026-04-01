-- Rangos de títulos y roles por nivel (por curso)
CREATE TABLE IF NOT EXISTS title_ranges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  title text NOT NULL,
  role text NOT NULL,
  level_min int NOT NULL,
  level_max int NOT NULL,
  sort_order int DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_title_ranges_course ON title_ranges(course_id);

-- Cantidad de tareas por tipo por bimestre (para el calculador de progresión)
ALTER TABLE bimestre_config ADD COLUMN IF NOT EXISTS task_counts jsonb DEFAULT '{}';
