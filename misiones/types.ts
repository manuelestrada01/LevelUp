export type MisionType = "interarea" | "intercurso" | "intracurso" | "comunidad";
export type MisionStatus = "activa" | "completada" | "expirada";

export interface Mision {
  id: string;
  type: MisionType;
  title: string;
  description: string;
  xpReward: number;
  status: MisionStatus;
  expiresAt?: Date;
  completedAt?: Date;
}
