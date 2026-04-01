export type MisionStatus = "pendiente" | "completada" | "atrasada";

export interface Mision {
  id: string;
  title: string;
  tipo: string;
  status: MisionStatus;
  xpReward: number;
  dueAt: Date | null;
  submittedAt?: Date;
}
