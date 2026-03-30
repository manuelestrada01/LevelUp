export type MisionType = "interarea" | "intercurso" | "intracurso" | "comunidad";
export type MisionStatus = "activa" | "completada" | "expirada";
export type MisionCategory = "gremio" | "encargo";

export interface Mision {
  id: string;
  category: MisionCategory;
  type: MisionType;
  title: string;
  description: string;
  xpReward: number;
  bonusXp?: number;
  status: MisionStatus;
  icon?: string;
  expiresAt?: Date;
  completedAt?: Date;
}
