export type ProductionType = "A4" | "A3" | "CAL" | "CAD" | "EVA" | "EVT";

export type LaminaStatus = "entregada" | "tardía" | "no_entregada" | "aprobada" | "rechazada";

export interface Lamina {
  id: string;
  productionType: ProductionType;
  title: string;
  dueDate: Date;
  submittedAt?: Date;
  status: LaminaStatus;
  xpEarned?: number;
  strikeAdded?: boolean;
  feedback?: string;
}
