import { ProductionType } from "./types";

export const XP_POR_TIPO: Record<string, number> = {
  A4: 20, A3: 50, CAL: 50, MAQ: 50, CAD: 35, EVA: 35, EVT: 50,
};
export const XP_BONUS_TEMPRANA = 15;

// Cumulative XP to START each level (index = nivel - 1)
export const XP_THRESHOLDS = [
  0, 173, 346, 520,
  613, 705, 798, 890, 983, 1075,
  1162, 1248, 1335, 1422, 1508, 1595,
  1734, 1873, 2011, 2150,
  2407, 2663,
  2916, 3168,
  3428, 3688,
  3966, 4243,
  4272, 4301, 4330, 4358, 4387, 4416,
  4474, 4531, 4589,
];

export interface LevelRange {
  min: number;
  max: number;
  title: string;
  nextTitle: string;
}

export const LEVEL_RANGES: LevelRange[] = [
  { min: 1,  max: 3,  title: "Iniciación",               nextTitle: "Fundamentos" },
  { min: 4,  max: 9,  title: "Fundamentos",              nextTitle: "Dominio Básico" },
  { min: 10, max: 15, title: "Dominio Básico",           nextTitle: "Maestría de Herramientas" },
  { min: 16, max: 19, title: "Maestría de Herramientas", nextTitle: "Camino Carpintero" },
  { min: 20, max: 21, title: "Camino Carpintero",        nextTitle: "Forja Soldador" },
  { min: 22, max: 23, title: "Forja Soldador",           nextTitle: "Recintos y Estructuras" },
  { min: 24, max: 25, title: "Recintos y Estructuras",   nextTitle: "Arte del Herrero" },
  { min: 26, max: 27, title: "Arte del Herrero",         nextTitle: "Ensamble Final" },
  { min: 28, max: 33, title: "Ensamble Final",           nextTitle: "Maestría Final" },
  { min: 34, max: 36, title: "Maestría Final",           nextTitle: "Maestría Final" },
];

export function calcNivelFromXp(xp: number): number {
  let level = 1;
  for (let i = 1; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 36);
}

export function getLevelRange(nivel: number): LevelRange {
  return LEVEL_RANGES.find((r) => nivel >= r.min && nivel <= r.max) ?? LEVEL_RANGES[0];
}

export function calcXpForDelivery(tipo: ProductionType | string, isEarly: boolean): number {
  const base = XP_POR_TIPO[tipo] ?? 0;
  return base + (isEarly ? XP_BONUS_TEMPRANA : 0);
}
