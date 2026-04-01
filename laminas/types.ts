export type LaminaStatus = "entregada" | "tardía" | "no_entregada" | "pendiente";

export interface Lamina {
  id: string;
  productionType: string;
  title: string;
  bimestre: string;
  dueDate: Date | null;
  submittedAt?: Date;
  status: LaminaStatus;
  xpEarned?: number;
  isEarly?: boolean;
  strikeAdded?: boolean;
}
