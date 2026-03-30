-- Migration 002: Dynamic configuration tables

-- Enable student visibility control per course
ALTER TABLE courses ADD COLUMN IF NOT EXISTS student_visible bool NOT NULL DEFAULT true;

-- ─────────────────────────────────────────────
-- Formative classes (admin-editable)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS formative_classes (
  slug        text PRIMARY KEY,
  title       text NOT NULL,
  inspiration text NOT NULL DEFAULT '',
  attributes  text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  published   bool NOT NULL DEFAULT false,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Seed default classes
INSERT INTO formative_classes (slug, title, inspiration, attributes, description, published, sort_order) VALUES
  ('barbaro',  'Bárbaro',  'Sansón',   ARRAY['Fuerza','Constitución'],        'La fuerza bruta al servicio de la creación. Empuja los límites con tenacidad y resistencia física.',    true, 1),
  ('bardo',    'Bardo',    'David',    ARRAY['Carisma','Destreza'],            'La habilidad y la expresión como puente entre las ideas y el mundo. Comunica con precisión y gracia.',   true, 2),
  ('clerigo',  'Clérigo',  'Samuel',   ARRAY['Sabiduría','Carisma'],          'Escucha, discerne y guía. Su fortaleza está en la reflexión y en el acompañamiento de otros.',           true, 3),
  ('paladin',  'Paladín',  'Moisés',   ARRAY['Fuerza','Carisma'],             'Liderazgo comprometido con el bien común. Une la firmeza con la vocación de servicio.',                  true, 4),
  ('druida',   'Druida',   'Noé',      ARRAY['Inteligencia','Sabiduría'],     'Comprende los sistemas y los ciclos. Cuida los procesos, construye con paciencia y visión de conjunto.',  true, 5),
  ('erudito',  'Erudito',  'Salomón',  ARRAY['Inteligencia','Sabiduría'],     'El conocimiento como herramienta. Analiza, sistematiza y profundiza para dominar el arte técnico.',      true, 6)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- Class history (per student)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS class_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_email text NOT NULL,
  class_slug    text NOT NULL REFERENCES formative_classes(slug),
  chosen_at     timestamptz DEFAULT now(),
  changed_from  text        -- previous class slug, nullable for first choice
);

CREATE INDEX IF NOT EXISTS idx_class_history_student ON class_history(student_email, chosen_at DESC);

-- ─────────────────────────────────────────────
-- XP config (per course, nullable course_id = global default)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS xp_config (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  tipo      text NOT NULL,
  label     text NOT NULL,
  xp_base   int NOT NULL DEFAULT 0,
  xp_early  int NOT NULL DEFAULT 0,
  UNIQUE(course_id, tipo)
);

-- Seed global defaults (course_id = null)
INSERT INTO xp_config (course_id, tipo, label, xp_base, xp_early) VALUES
  (null, 'A4',  'Lámina A4',            20, 15),
  (null, 'A3',  'Lámina A3',            50, 15),
  (null, 'CAL', 'Caligrafía',           50, 15),
  (null, 'MAQ', 'Maqueta',              50, 15),
  (null, 'CAD', 'AutoCAD',              35, 15),
  (null, 'EVA', 'Evaluación',           35,  0),
  (null, 'EVT', 'Evento especial',      50,  0)
ON CONFLICT (course_id, tipo) DO NOTHING;

-- ─────────────────────────────────────────────
-- Level config (global, 36 levels)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS level_config (
  nivel         int PRIMARY KEY,
  xp_threshold  int NOT NULL,
  title         text NOT NULL,
  role          text NOT NULL
);

INSERT INTO level_config (nivel, xp_threshold, title, role) VALUES
  (1,  0,    'Iniciación',               'Aprendiz'),
  (2,  173,  'Iniciación',               'Aprendiz'),
  (3,  346,  'Iniciación',               'Aprendiz'),
  (4,  520,  'Fundamentos',              'Estudiante'),
  (5,  613,  'Fundamentos',              'Estudiante'),
  (6,  705,  'Fundamentos',              'Estudiante'),
  (7,  798,  'Fundamentos',              'Estudiante'),
  (8,  890,  'Fundamentos',              'Estudiante'),
  (9,  983,  'Fundamentos',              'Estudiante'),
  (10, 1075, 'Dominio Básico',           'Artesano'),
  (11, 1162, 'Dominio Básico',           'Artesano'),
  (12, 1248, 'Dominio Básico',           'Artesano'),
  (13, 1335, 'Dominio Básico',           'Artesano'),
  (14, 1422, 'Dominio Básico',           'Artesano'),
  (15, 1508, 'Dominio Básico',           'Artesano'),
  (16, 1595, 'Maestría de Herramientas', 'Oficial'),
  (17, 1734, 'Maestría de Herramientas', 'Oficial'),
  (18, 1873, 'Maestría de Herramientas', 'Oficial'),
  (19, 2011, 'Maestría de Herramientas', 'Oficial'),
  (20, 2150, 'Camino Carpintero',        'Carpintero'),
  (21, 2407, 'Camino Carpintero',        'Carpintero'),
  (22, 2663, 'Forja Soldador',           'Soldador'),
  (23, 2916, 'Forja Soldador',           'Soldador'),
  (24, 3168, 'Recintos y Estructuras',   'Constructor'),
  (25, 3428, 'Recintos y Estructuras',   'Constructor'),
  (26, 3688, 'Arte del Herrero',         'Herrero'),
  (27, 3966, 'Arte del Herrero',         'Herrero'),
  (28, 4243, 'Ensamble Final',           'Maestro de Obra'),
  (29, 4272, 'Ensamble Final',           'Maestro de Obra'),
  (30, 4301, 'Ensamble Final',           'Maestro de Obra'),
  (31, 4330, 'Ensamble Final',           'Maestro de Obra'),
  (32, 4358, 'Ensamble Final',           'Maestro de Obra'),
  (33, 4387, 'Ensamble Final',           'Maestro de Obra'),
  (34, 4416, 'Maestría Final',           'Gran Maestro'),
  (35, 4474, 'Maestría Final',           'Gran Maestro'),
  (36, 4531, 'Maestría Final',           'Gran Maestro')
ON CONFLICT (nivel) DO NOTHING;

-- ─────────────────────────────────────────────
-- Talent config (global, admin-editable)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS talent_config (
  slug        text PRIMARY KEY,
  name        text NOT NULL,
  attributes  text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  conditions  jsonb NOT NULL DEFAULT '{}',
  active      bool NOT NULL DEFAULT true,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

INSERT INTO talent_config (slug, name, attributes, description, active, sort_order) VALUES
  ('mano-firme',                  'Mano Firme',                    ARRAY['Destreza','Constitución'],     'Precisión y control en trazos e instrumentos.',                             true, 1),
  ('perseverancia-activa',        'Perseverancia Activa',          ARRAY['Sabiduría','Constitución'],    'Sostiene el esfuerzo aun en tareas repetitivas o complejas.',                true, 2),
  ('espiritu-colaborador',        'Espíritu Colaborador',          ARRAY['Sabiduría','Carisma'],         'Construye con otros sin imponerse.',                                         true, 3),
  ('resistencia-al-error',        'Resistencia al Error',          ARRAY['Constitución','Fuerza'],       'Enfrenta correcciones sin frustrarse.',                                      true, 4),
  ('claridad-comunicativa',       'Claridad Comunicativa',         ARRAY['Carisma','Inteligencia'],      'Explica ideas técnicas de forma clara y comprensible.',                      true, 5),
  ('dominio-instrumental',        'Dominio Instrumental',          ARRAY['Destreza','Fuerza'],           'Uso correcto y consciente de herramientas manuales y digitales.',            true, 6),
  ('constancia-silenciosa',       'Constancia Silenciosa',         ARRAY['Destreza','Constitución'],     'Cumple y avanza sin necesidad de sobresalir.',                               true, 7),
  ('atencion-al-detalle',         'Atención al Detalle',           ARRAY['Destreza','Sabiduría'],        'Detecta fallas que afectan el conjunto antes de entregar.',                  true, 8),
  ('autogestion-del-aprendizaje', 'Autogestión del Aprendizaje',   ARRAY['Inteligencia','Constitución'], 'Planifica y gestiona su propio proceso de aprendizaje.',                     true, 9),
  ('liderazgo-servicial',         'Liderazgo Servicial',           ARRAY['Carisma','Sabiduría'],         'Ayuda a otros a avanzar sin ponerse por encima.',                            true, 10),
  ('enfoque-y-concentracion',     'Enfoque y Concentración',       ARRAY['Destreza','Sabiduría'],        'Sostiene la atención durante períodos prolongados.',                         true, 11)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- Bimestre config (per course)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bimestre_config (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  bimestre   text NOT NULL,
  start_date date NOT NULL,
  end_date   date NOT NULL,
  UNIQUE(course_id, bimestre)
);
