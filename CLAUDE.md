# CLAUDE.md — LevelUp: Visor Académico Gamificado

## Contexto del Proyecto

**LevelUp** es el visor académico gamificado del proyecto institucional *"Del Taller Artesanal al Mundo Digital"* (Arq. Lucas Bardelli, 2026), implementado en la **Escuela Cristiana Evangélica Argentina**.

- **Nivel:** Educación Secundaria Técnica – Modalidad Técnico Profesional
- **Espacio curricular:** Tecnología de la Representación (1°, 2° y 3° año)
- **Docentes:** Lucas Bardelli, Jazmin Soza Giraldez, Ignacio Salvatierra
- **Año:** 2026

El sistema **no reemplaza** la evaluación institucional. Es una **capa de síntesis y lectura** que permite al estudiante visualizar su recorrido, reconocer su esfuerzo y asumir un rol activo en su aprendizaje.

---

## Stack Técnico

- **Frontend:** Next.js (App Router) + TypeScript
- **Estilos:** Tailwind CSS — paleta oscura (verde bosque + dorado ámbar)
- **Fuentes:** serif elegante para títulos (Playfair Display), sans-serif limpio para cuerpo (Inter)
- **Fuente de datos:** Google Classroom API (read-only) — entregas, fechas, estados, roster
- **Base de datos:** Supabase (Postgres) — fuente de verdad para todo el estado gamificado
- **Auth:** Google OAuth (alumnos y docentes se autentican con cuenta institucional)
- **Google Sheets:** ~~eliminado~~ — no se usa en ninguna parte del sistema

---

## Diseño Visual (Figma)

La UI sigue estrictamente el diseño del Figma compartido. Características clave:

### Paleta de colores
- Fondo principal: `#0d1a0f` (verde muy oscuro / negro bosque)
- Superficie cards: `#1a2e1c` / `#1e3320`
- Acento primario: `#c9a227` (dorado ámbar)
- Acento secundario: `#8fbc8f` (verde claro)
- Texto principal: `#f5f0e8` (blanco cálido)
- Texto secundario: `#9aab8a`
- Strikes / peligro: `#c0392b`

### Layout alumno
- **Sidebar izquierdo** (íconos): Dashboard, Misiones, Bitácora, Insignias, Clases Formativas
- **Header:** Logo "Visor Académico" + tabs de materias + notificaciones + avatar
- **Hero section:** Banner full-width temático, saludo personalizado con nombre y clase activa
- **Dashboard principal:** grid de cards — XP, Strikes, Actividad reciente, Talentos activos, Clases Formativas

### Layout admin/docente (`/teacher`)
- **Sidebar izquierdo** (íconos, 64px): Dashboard, Cursos, Configuración macro
- **Header:** "Visor Académico — Panel Docente" + nombre docente + logout

---

## Roles del Sistema

### Alumno
- Accede a `/` (dashboard)
- Solo puede ver cursos que el docente habilitó explícitamente
- Puede elegir y cambiar su Clase Formativa (con registro histórico)
- Ve su XP, nivel, strikes, actividad, talentos

### Docente / Admin (`/teacher`)
- Accede a `/teacher`
- Detectado por: (1) tabla `courses` en Supabase, o (2) Classroom API (`teacherId: "me"`)
- Gestiona cursos, configura tipos de producción, sincroniza con Classroom
- **Habilita** cursos para que los alumnos puedan verlos
- Ejecuta excepciones sobre alumnos (ver Panel Docente)

---

## Navegación Panel Docente

### Ventana: Dashboard (`/teacher`)
- Stats generales: cursos activos, total alumnos, alumnos en riesgo
- Última sincronización

### Ventana: Cursos (`/teacher/courses`)
- Lista de cursos registrados + botón "Agregar curso de Classroom"
- Al agregar: seleccionar de los cursos disponibles en Classroom, asignar año curricular
- El docente puede habilitar/deshabilitar la visibilidad del curso para alumnos

#### Dentro de cada curso (`/teacher/courses/[id]`), 4 sub-secciones:

**1. Resumen Académico**
- Gráficos y estadísticas del curso
- Cantidad de alumnos en riesgo / bloqueados
- Top de Clases Formativas (ranking por cantidad de alumnos)
- Distribución de XP, niveles, strikes

**2. Panel Docente**
- Tabla de alumnos con XP, nivel, strikes, estado
- Sincronizar datos desde Classroom
- Acciones sobre uno o más alumnos:
  - Forzar desbloqueo de bimestre
  - Anular strike / forzar strike
  - Habilitar evaluación extraordinaria
  - Habilitar evento (especificar XP del evento)
  - Registrar Calidad Técnica Destacada (XP bonus manual)
  - Anular talento / forzar talento
- Todas las acciones quedan registradas en `teacher_exceptions`

**3. Lista de Alumnos**
- Vista detallada por alumno: historial de entregas, strikes activos, talentos, distinciones
- Registro histórico de Clases Formativas elegidas por el alumno

**4. Configuración de Administrador (por curso)**
- **XP por tipo de producción:** el admin asigna XP base a cada tipo. Los tipos se generan dinámicamente desde las categorías de calificación de Classroom (no son fijos: A4/A3/CAL son ejemplos, no hardcoded)
- **Niveles por título y rol:** configurar umbrales de XP → título → rol simbólico
- **Talentos:** crear/editar talentos (Título, Atributos, Descripción, Condiciones de otorgamiento). El sistema los otorga automáticamente según condiciones. El mismo talento se otorga solo una vez.
- **Fechas de bimestre:** definir rangos de fechas para B1, B2, B3, B4. El sistema determina el bimestre activo en tiempo real según fecha y hora actual.

### Ventana: Configuración Macro (`/teacher/config`)
- **Clases Formativas:** gestión completa en forma de Cards editables
  - Campos: Título de Clase, Inspiración bíblica, Atributos (máx. 2), Descripción
  - El admin publica/despublica cada clase
  - Solo las clases publicadas aparecen disponibles para que el alumno elija
  - Son una capa simbólica — no afectan la nota institucional

---

## Lógica de Negocio Central

### Sistema XP (Experiencia)

La XP **nunca se pierde** y es acumulativa a lo largo del ciclo lectivo.

**Fuentes de XP:**
| Tipo | Condición | XP |
|------|-----------|-----|
| XP Base | Entrega en término | configurada por admin por tipo |
| XP Silenciosa | Entrega ≥ 24h antes del deadline | bonus sobre base |
| Calidad Técnica Destacada | Ingreso manual desde Panel Docente | bonus adicional |
| Evento | Habilitado por docente (inter/intra-curso) | XP especificada por docente |

**Tipos de producción:**
- Son **dinámicos** — se extraen de las categorías de calificación de Classroom
- El docente los mapea y el admin les asigna XP base en la Configuración de Administrador
- Ejemplos típicos: `A4`, `A3`, `CAL`, `CAD`, `EVA`, `EVT` — pero pueden variar por curso

### Sistema Strikes (Incumplimientos)

Los strikes **no vencen solos** y **nunca compensan XP**.

**Causas de strike (+1 cada una, independiente):**
- No entrega → +1 strike
- Entrega tarde → +1 strike
- Falta de material → +1 strike

**Límite:** 3 strikes activos → **bloqueo automático de bimestre**

### Bloqueo de Bimestre

Al bloquearse:
- XP congelada
- Nivel congelado
- Entregas registradas pero sin efecto positivo

**Desbloqueo:** entregar todo lo pendiente + aprobar EVA presencial (lámina A4 en tablero, en el día).

| Acción | Efecto |
|--------|--------|
| EVA aprobada | Se reinician strikes |
| EVA desaprobada | Continúa bloqueo |

El docente puede forzar desbloqueo manualmente desde el Panel Docente (queda registrado).

### Bimestres

- El docente define **rangos de fechas** para B1, B2, B3, B4 en la Configuración de Administrador
- El sistema detecta automáticamente el bimestre activo según la fecha/hora actual
- El campo `bimestre_activo` en `courses` refleja el bimestre actual calculado

### Niveles y Roles

- Los niveles se alcanzan por umbrales de XP configurados en la Configuración de Administrador
- **No hay retroceso de nivel**
- Cada nivel tiene un título y rol simbólico, configurables por el admin
- Por defecto en `xp/engine.ts` hay 36 niveles con títulos narrativos

### Visibilidad de Cursos

- Un alumno **solo puede ver** un curso si el docente lo habilitó explícitamente
- Campo `active` en tabla `courses` controla esto
- El alumno puede estar inscripto en Classroom pero no ver el curso en LevelUp hasta que el docente lo habilite

---

## Clases Formativas

Las clases son **personales, voluntarias y dinámicas** — pueden cambiar con el tiempo.

- Son una capa simbólica, **no afectan la nota institucional**
- La base de clases se configura desde **Configuración Macro** del panel docente
- Cada clase tiene: Título, Inspiración bíblica, Atributos (máx. 2), Descripción
- El admin **publica** las clases disponibles; el alumno elige entre las publicadas
- Los cambios de clase a lo largo del ciclo quedan **registrados históricamente**
- Tanto el alumno como el admin pueden consultar el historial de clases elegidas

**Clases base actuales (editables vía Configuración Macro):**
| Clase | Inspiración | Atributos |
|-------|-------------|-----------|
| Bárbaro | Sansón | Fuerza · Constitución |
| Bardo | David | Carisma · Destreza |
| Clérigo | Samuel | Sabiduría · Carisma |
| Paladín | Moisés | Fuerza · Carisma |
| Druida | Noé | Inteligencia · Sabiduría |
| Erudito | Salomón | Inteligencia · Sabiduría |

**Atributos del sistema:** Fuerza · Constitución · Destreza · Carisma · Sabiduría · Inteligencia

---

## Talentos

Habilidades concretas configuradas y gestionadas desde la **Configuración de Administrador**.

- Cada talento tiene: Título, Atributos (máx. 2), Descripción, Condiciones de otorgamiento
- El sistema los otorga automáticamente cuando el alumno cumple las condiciones
- El docente puede forzar o anular talentos manualmente desde el Panel Docente
- **El mismo talento se otorga una sola vez** (no se acumula)

**Talentos base actuales (editables):**
- Mano Firme — Destreza · Constitución
- Perseverancia Activa — Sabiduría · Constitución
- Espíritu Colaborador — Sabiduría · Carisma
- Resistencia al Error — Constitución · Fuerza
- Claridad Comunicativa — Carisma · Inteligencia
- Dominio Instrumental — Destreza · Fuerza
- Constancia Silenciosa — Destreza · Constitución
- Atención al Detalle — Destreza · Sabiduría
- Autogestión del Aprendizaje — Inteligencia · Constitución
- Liderazgo Servicial — Carisma · Sabiduría
- Enfoque y Concentración — Destreza · Sabiduría

---

## Arquitectura de Datos

### Flujo principal
```
Classroom API (read-only)
       ↓  sync on-demand (TTL 5 min por curso)
  Sync Engine (lib/sync/classroom.ts)
       ↓  computar XP, strikes, niveles
  XP Engine (xp/engine.ts)
       ↓  persistir
  Supabase (fuente de verdad)
       ↓  leer
  Student Dashboard  /  Teacher Dashboard
```

### Tablas Supabase
| Tabla | Propósito |
|-------|-----------|
| `student_profiles` | Perfil alumno: clase formativa activa, display_name |
| `courses` | Cursos registrados por docentes |
| `coursework_config` | Mapeo tarea Classroom → tipo de producción |
| `deliveries` | Entregas sincronizadas y computadas |
| `strikes` | Strikes individuales (no vencen, se anulan) |
| `student_game_state` | Estado gamificado cacheado (XP, nivel, strikes, bloqueado) |
| `talent_grants` | Talentos otorgados |
| `distinction_grants` | Distinciones/insignias otorgadas |
| `teacher_exceptions` | Registro de todas las excepciones docentes |

### Motor de Sincronización
- `lib/sync/classroom.ts` — sync on-demand con TTL 5 min
- `lib/supabase/courses.ts` — CRUD cursos y coursework_config
- `lib/supabase/game.ts` — game state, deliveries, strikes
- `lib/supabase/teacher.ts` — talents, distinctions, exceptions
- `xp/engine.ts` — cálculo puro de XP y niveles (funciones sin side effects)

---

## Estructura de Carpetas (Screaming Architecture)

```
levelup/
├── app/                        # Routing ONLY (Next.js App Router)
│   ├── (auth)/login/
│   ├── (dashboard)/            # Rutas alumno
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── distinciones/
│   │   ├── laminas/
│   │   ├── misiones/
│   │   └── clases-formativas/
│   ├── teacher/                # Rutas panel docente/admin
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard docente
│   │   ├── courses/
│   │   │   ├── page.tsx        # Lista + agregar cursos
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Detalle curso (Panel Docente)
│   │   │       └── setup/      # Configurar tipos de tareas
│   │   ├── students/[email]/   # Detalle alumno
│   │   └── config/             # Configuración Macro (Clases Formativas)
│   └── api/
│       ├── courses/
│       └── students/[email]/
│
├── dashboard/                  # Feature: resumen académico alumno
├── xp/                         # Dominio: XP y niveles (engine.ts)
├── strikes/                    # Dominio: strikes
├── clases-formativas/          # Feature: clases formativas alumno
├── talentos/                   # Feature: talentos
├── distinciones/               # Feature: insignias
├── laminas/                    # Feature: entregas
├── misiones/                   # Feature: misiones
├── docente/                    # Feature: componentes panel docente
│   └── components/
├── layout/                     # Shared: Sidebar, Header (alumno)
├── shared/ui/                  # Primitivos UI reutilizables
├── lib/
│   ├── google/classroom.ts     # Classroom API (read-only)
│   ├── supabase/               # courses, game, teacher, profiles
│   └── sync/classroom.ts       # Motor de sincronización
├── supabase/migrations/        # SQL migrations
└── public/assets/
```

---

## Convenciones de Código

- **Arquitectura:** Screaming Architecture — carpetas raíz por dominio/feature, `app/` solo routing
- **Tailwind content paths:** cada nuevo dominio raíz debe agregarse en `tailwind.config.ts` → `content[]`
- TypeScript estricto (`strict: true`)
- Componentes en PascalCase, archivos en kebab-case
- Server Components por defecto; Client Components solo cuando sea necesario (`"use client"`)
- Tailwind para todo el styling — sin CSS modules salvo excepciones justificadas
- Nombres de variables/funciones en inglés; contenido/copy en español
- No agregar comentarios salvo lógica no obvia
- Tipos e interfaces definidos en el `types.ts` de su dominio correspondiente
- **`redirect()` de Next.js lanza NEXT_REDIRECT** — nunca envolverlo en try-catch sin re-lanzar

---

## Terminología del Proyecto

| Término en sistema | Término en UI |
|--------------------|---------------|
| XP | Resonancia de Experiencia |
| Strike | Strike Académico |
| Level | Nivel |
| Badge/Insignia | Distinción |
| Class | Clase Formativa |
| Talent | Talento Activo |
| Activity feed | Fragmentos de Actividad |
| Bimester lock | Bloqueo de Bimestre |
| Admin panel | Panel Docente / Visor Admin |

---

## Notas Importantes

- El foco UX es el **alumno** (vista principal). El docente tiene panel separado.
- La identidad visual es **bosque oscuro + alquimia medieval** — evitar elementos que rompan esa atmósfera.
- El hero de la home muestra siempre la **clase activa del alumno** con su nombre personalizado.
- Los strikes se muestran como íconos X (activos en rojo, vacíos/grises).
- La XP bar muestra progreso al siguiente nivel.
- Toda la app debe ser **responsive** (mobile-first).
- Google Sheets **no existe** en el sistema — no crear ninguna integración con Sheets.
- Los tipos de producción **no son hardcoded** — se configuran por admin y derivan de Classroom.
- Las Clases Formativas son editables por el admin — el código no debe asumir las 6 clases fijas.
- Los talentos son editables por el admin — el array `ALL_TALENTS` en `talentos/types.ts` es solo el estado inicial, eventualmente debe leerse desde Supabase.


<!-- autoskills:start -->
<!-- autoskills:end -->
