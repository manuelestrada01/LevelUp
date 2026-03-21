# CLAUDE.md — LevelUp: Visor Académico Gamificado

## Contexto del Proyecto

**LevelUp** es el visor académico gamificado del proyecto institucional *"Del Taller Artesanal al Mundo Digital"* (Arq. Lucas Bardelli, 2025), implementado en la **Escuela Cristiana Evangélica Argentina**.

- **Nivel:** Educación Secundaria Técnica – Modalidad Técnico Profesional
- **Espacio curricular:** Tecnología de la Representación (1°, 2° y 3° año)
- **Docentes:** Lucas Bardelli, Jazmin Soza Giraldez, Ignacio Salvatierra
- **Año:** 2026

El sistema **no reemplaza** la evaluación institucional. Es una **capa de síntesis y lectura** que permite al estudiante visualizar su recorrido, reconocer su esfuerzo y asumir un rol activo en su aprendizaje.

---

## Stack Técnico

- **Frontend:** Next.js (App Router) + TypeScript
- **Estilos:** Tailwind CSS — paleta oscura (verde bosque + dorado ámbar)
- **Fuentes:** serif elegante para títulos (ej. Playfair Display), sans-serif limpio para cuerpo (ej. Inter)
- **Backend de datos:** Google Classroom API + Google Sheets API (fuente de verdad)
- **Base de datos local:** (a definir según necesidad — puede ser Postgres/Supabase)
- **Auth:** Google OAuth (alumnos se autentican con cuenta institucional)

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

### Layout
- **Sidebar izquierdo** (colapsable): navegación principal con íconos
- **Header:** Logo "Visor Académico" + tabs de materias (Tecnología de la Rep. 1 / 2 / 3) + notificaciones + avatar
- **Hero section:** Banner full-width con imagen de fondo temática (bosque/naturaleza), saludo personalizado con nombre y clase del estudiante
- **Dashboard principal:** grid de cards — XP, Strikes, Actividad reciente, Talentos activos, Clases Formativas

### Navegación sidebar
- Dashboard
- Distinciones (insignias)
- Láminas/Tareas
- Community/Misiones
- Clases Formativas

---

## Lógica de Negocio Central

### Sistema XP (Experiencia)

La XP **nunca se pierde** y es acumulativa a lo largo del ciclo lectivo.

**Fuentes de XP:**
| Tipo | Condición | XP |
|------|-----------|-----|
| XP Base | Entrega en término | según tipo |
| XP Silenciosa | Entrega ≥ 24h antes del deadline | bonus sobre base |
| Calidad Técnica Destacada | Solo al aprobar corrección | bonus adicional |
| Eventos | Interáreas, intercurso, intracurso | variable |

**Tipos de producción:**
- `A4` — Lámina A4 (1/semana, en aula, obligatoria)
- `A3` — Lámina A3 (según planificación, producción final)
- `CAL` — Caligrafía (1 carilla semanal, crítica para aprobación)
- `CAD` — AutoCAD (según año, crítica para aprobación)
- `EVA` — Evaluación presencial (según año)
- `EVT` — Evento especial

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

### Niveles y Roles

Los niveles se alcanzan por umbrales de XP. **No hay retroceso de nivel.** Cada nivel habilita un rol simbólico.

### Ajustes por Año

| Año | XP | Bonus calidad | Extras |
|-----|-----|--------------|--------|
| 1° | Reducida | Sin bonus | Foco hábito/constancia |
| 2° | Estándar | Limitado | Introducción CAD |
| 3° | Completa | Activos | Evaluaciones integradoras |

---

## Clases Formativas

Las clases son **personales, voluntarias y dinámicas** (pueden cambiar con el tiempo). Son una capa simbólica, no afectan la nota institucional.

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

Habilidades concretas que emergen de forma sostenida (no se otorgan arbitrariamente):

- **Mano Firme** — Destreza · Constitución
- **Perseverancia Activa** — Sabiduría · Constitución
- **Espíritu Colaborador** — Sabiduría · Carisma
- **Resistencia al Error** — Constitución · Fuerza
- **Claridad Comunicativa** — Carisma · Inteligencia
- **Dominio Instrumental** — Destreza · Fuerza
- **Constancia Silenciosa** — Destreza · Constitución
- **Atención al Detalle** — Destreza · Sabiduría
- **Autogestión del Aprendizaje** — Inteligencia · Constitución
- **Liderazgo Servicial** — Carisma · Sabiduría
- **Enfoque y Concentración** — Destreza · Sabiduría

---

## Fuentes de Datos

El sistema **lee** desde:
- **Google Classroom:** entregas, fechas, estados, materiales
- **Google Sheets:** registro docente complementario (strikes manuales, excepciones, notas)

El visor **no modifica** estas plataformas. Solo las lee y sintetiza.

### Excepciones Docentes (via Sheets o panel admin)
- Forzar desbloqueo
- Anular strike
- Habilitar evaluación extraordinaria
- Toda excepción queda registrada

---

## Estructura de Carpetas (Screaming Architecture)

La estructura grita de qué trata la app. Organizada por dominio/feature, no por tipo técnico.

```
levelup/
├── app/                        # Routing ONLY (Next.js App Router)
│   ├── (auth)/login/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Ensambla layout: Sidebar + Header + main
│   │   ├── page.tsx            # Home/Dashboard
│   │   ├── distinciones/
│   │   ├── laminas/
│   │   ├── misiones/
│   │   └── clases-formativas/
│   └── api/
│       ├── classroom/
│       └── sheets/
│
├── dashboard/                  # Feature: resumen académico
│   ├── components/             # XpCard, StrikesCard, ActivityFeed…
│   └── types.ts
│
├── xp/                         # Dominio: sistema de experiencia
│   ├── components/             # XpBar, XpBadge…
│   ├── xp.ts                   # Lógica de cálculo
│   └── types.ts
│
├── strikes/                    # Dominio: sistema de incumplimientos
│   ├── components/             # StrikeIcon, StrikesDisplay…
│   └── types.ts
│
├── clases-formativas/          # Feature: clases y atributos
│   ├── components/             # ClassCard, AttributeBadge…
│   └── types.ts
│
├── talentos/                   # Feature: talentos activos
│   ├── components/             # TalentCard, TalentBadge…
│   └── types.ts
│
├── distinciones/               # Feature: insignias y logros
│   ├── components/
│   └── types.ts
│
├── laminas/                    # Feature: entregas y láminas
│   ├── components/
│   └── types.ts
│
├── misiones/                   # Feature: misiones / community
│   ├── components/
│   └── types.ts
│
├── layout/                     # Shared: Sidebar, Header
│   ├── Sidebar.tsx
│   └── Header.tsx
│
├── shared/ui/                  # Primitivos UI reutilizables (Button, Card…)
│
├── lib/google/                 # Integraciones externas (Classroom + Sheets)
│
└── public/assets/              # Imágenes, íconos de clases
```

---

## Convenciones de Código

- **Arquitectura:** Screaming Architecture — carpetas raíz por dominio/feature, `app/` solo routing
- **Tailwind content paths:** cada nuevo dominio raíz debe agregarse en `tailwind.config.ts` → `content[]`, de lo contrario las clases no se generan
- TypeScript estricto (`strict: true`)
- Componentes en PascalCase, archivos en kebab-case
- Server Components por defecto; Client Components solo cuando sea necesario (`"use client"`)
- Tailwind para todo el styling — sin CSS modules salvo excepciones justificadas
- Nombres de variables/funciones en inglés; contenido/copy en español (como en el diseño)
- No agregar comentarios salvo lógica no obvia
- Tipos e interfaces definidos en el `types.ts` de su dominio correspondiente

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

---

## Notas Importantes

- El foco UX es el **alumno** (vista principal). El docente tiene panel separado (admin).
- La identidad visual es **bosque oscuro + alquimia medieval** — evitar elementos que rompan esa atmósfera.
- El hero de la home muestra siempre la **clase activa del alumno** con su nombre personalizado.
- Los strikes se muestran como íconos X (activos en rojo, vacíos/grises).
- La XP bar muestra progreso al siguiente nivel con etiquetas "NIVEL ACTUAL" y "PRÓXIMO NIVEL".
- Toda la app debe ser **responsive** (mobile-first).
