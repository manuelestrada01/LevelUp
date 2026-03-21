export interface Talent {
  id: string;
  name: string;
  description: string;
  attributes: [string, string];
}

export const ALL_TALENTS: Talent[] = [
  {
    id: "mano-firme",
    name: "Mano Firme",
    description: "Precisión y control en trazos e instrumentos.",
    attributes: ["Destreza", "Constitución"],
  },
  {
    id: "perseverancia-activa",
    name: "Perseverancia Activa",
    description: "Sostiene el esfuerzo aun en tareas repetitivas o complejas.",
    attributes: ["Sabiduría", "Constitución"],
  },
  {
    id: "espiritu-colaborador",
    name: "Espíritu Colaborador",
    description: "Construye con otros sin imponerse.",
    attributes: ["Sabiduría", "Carisma"],
  },
  {
    id: "resistencia-al-error",
    name: "Resistencia al Error",
    description: "Enfrenta correcciones sin frustrarse.",
    attributes: ["Constitución", "Fuerza"],
  },
  {
    id: "claridad-comunicativa",
    name: "Claridad Comunicativa",
    description: "Explica ideas técnicas de forma clara y comprensible.",
    attributes: ["Carisma", "Inteligencia"],
  },
  {
    id: "dominio-instrumental",
    name: "Dominio Instrumental",
    description: "Uso correcto y consciente de herramientas manuales y digitales.",
    attributes: ["Destreza", "Fuerza"],
  },
  {
    id: "constancia-silenciosa",
    name: "Constancia Silenciosa",
    description: "Cumple y avanza sin necesidad de sobresalir.",
    attributes: ["Destreza", "Constitución"],
  },
  {
    id: "atencion-al-detalle",
    name: "Atención al Detalle",
    description: "Detecta fallas que afectan el conjunto antes de entregar.",
    attributes: ["Destreza", "Sabiduría"],
  },
  {
    id: "autogestion-del-aprendizaje",
    name: "Autogestión del Aprendizaje",
    description: "Planifica y gestiona su propio proceso de aprendizaje.",
    attributes: ["Inteligencia", "Constitución"],
  },
  {
    id: "liderazgo-servicial",
    name: "Liderazgo Servicial",
    description: "Ayuda a otros a avanzar sin ponerse por encima.",
    attributes: ["Carisma", "Sabiduría"],
  },
  {
    id: "enfoque-y-concentracion",
    name: "Enfoque y Concentración",
    description: "Sostiene la atención durante períodos prolongados.",
    attributes: ["Destreza", "Sabiduría"],
  },
];
