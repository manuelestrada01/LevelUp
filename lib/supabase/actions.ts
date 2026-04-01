import { supabase } from "./client";

export type ActionType =
  | "strike_force"
  | "strike_annul"
  | "mission_annul"
  | "unlock"
  | "xp_event"
  | "xp_quality"
  | "xp_extraordinary"
  | "talent";

export interface ActionGroup {
  id: string;
  course_id: string;
  type: ActionType;
  subtype: string | null;
  title: string;
  description: string | null;
  xp_value: number | null;
  talent_slug: string | null;
  affected_emails: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export async function getActionGroups(courseId: string): Promise<ActionGroup[]> {
  const { data, error } = await supabase
    .from("teacher_action_groups")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ActionGroup[]) ?? [];
}

export async function createActionGroup(
  group: Omit<ActionGroup, "id" | "created_at" | "updated_at">
): Promise<ActionGroup> {
  const { data, error } = await supabase
    .from("teacher_action_groups")
    .insert(group)
    .select()
    .single();
  if (error) throw error;
  return data as ActionGroup;
}
