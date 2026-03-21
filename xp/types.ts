export type ProductionType = "A4" | "A3" | "CAL" | "CAD" | "EVA" | "EVT";

export type ActivityEventType =
  | "xp_base"
  | "xp_silent"
  | "xp_quality"
  | "xp_event"
  | "strike_added"
  | "strike_removed"
  | "level_up"
  | "badge_earned"
  | "bimester_blocked"
  | "bimester_unlocked";

export interface ActivityEntry {
  id: string;
  type: ActivityEventType;
  description: string;
  xpDelta?: number;
  timestamp: Date;
  productionType?: ProductionType;
}
