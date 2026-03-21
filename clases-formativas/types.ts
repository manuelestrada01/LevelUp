export type FormativeClass =
  | "barbaro"
  | "bardo"
  | "clerigo"
  | "paladin"
  | "druida"
  | "erudito";

export const CLASS_LABELS: Record<FormativeClass, string> = {
  barbaro: "Bárbaro",
  bardo: "Bardo",
  clerigo: "Clérigo",
  paladin: "Paladín",
  druida: "Druida",
  erudito: "Erudito",
};

export const CLASS_ATTRIBUTES: Record<FormativeClass, [string, string]> = {
  barbaro: ["Fuerza", "Constitución"],
  bardo: ["Carisma", "Destreza"],
  clerigo: ["Sabiduría", "Carisma"],
  paladin: ["Fuerza", "Carisma"],
  druida: ["Inteligencia", "Sabiduría"],
  erudito: ["Inteligencia", "Sabiduría"],
};
