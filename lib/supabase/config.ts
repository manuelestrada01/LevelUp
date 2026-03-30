import { supabase } from "./client";

export interface XpConfigEntry {
  id?: string;
  course_id: string | null;
  tipo: string;
  label: string;
  xp_base: number;
  xp_early: number;
}

export interface LevelConfigEntry {
  nivel: number;
  xp_threshold: number;
  title: string;
  role: string;
}

export interface TalentConfigEntry {
  slug: string;
  name: string;
  attributes: string[];
  description: string;
  conditions: Record<string, unknown>;
  active: boolean;
  sort_order: number;
}

export interface BimestreConfigEntry {
  id?: string;
  course_id: string;
  bimestre: string;
  start_date: string;
  end_date: string;
}

// ─── XP Config ───────────────────────────────

export async function getXpConfig(courseId?: string): Promise<XpConfigEntry[]> {
  if (courseId) {
    const { data } = await supabase
      .from("xp_config")
      .select("*")
      .eq("course_id", courseId)
      .order("tipo");
    if (data && data.length > 0) return data;
  }
  const { data } = await supabase
    .from("xp_config")
    .select("*")
    .is("course_id", null)
    .order("tipo");
  return data ?? [];
}

export async function upsertXpConfig(entries: XpConfigEntry[]) {
  const { error } = await supabase.from("xp_config").upsert(entries, {
    onConflict: "course_id,tipo",
  });
  if (error) throw error;
}

// ─── Level Config ────────────────────────────

export async function getLevelConfig(): Promise<LevelConfigEntry[]> {
  const { data } = await supabase
    .from("level_config")
    .select("*")
    .order("nivel");
  return data ?? [];
}

export async function upsertLevelConfig(entries: LevelConfigEntry[]) {
  const { error } = await supabase.from("level_config").upsert(entries, {
    onConflict: "nivel",
  });
  if (error) throw error;
}

// ─── Talent Config ───────────────────────────

export async function getTalentConfig(): Promise<TalentConfigEntry[]> {
  const { data } = await supabase
    .from("talent_config")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function upsertTalentConfig(entry: TalentConfigEntry) {
  const { error } = await supabase
    .from("talent_config")
    .upsert({ ...entry, updated_at: new Date().toISOString() }, { onConflict: "slug" });
  if (error) throw error;
}

export async function deleteTalentConfig(slug: string) {
  const { error } = await supabase.from("talent_config").delete().eq("slug", slug);
  if (error) throw error;
}

// ─── Bimestre Config ─────────────────────────

export async function getBimestreConfig(courseId: string): Promise<BimestreConfigEntry[]> {
  const { data } = await supabase
    .from("bimestre_config")
    .select("*")
    .eq("course_id", courseId)
    .order("bimestre");
  return data ?? [];
}

export async function upsertBimestreConfig(entries: BimestreConfigEntry[]) {
  const { error } = await supabase.from("bimestre_config").upsert(entries, {
    onConflict: "course_id,bimestre",
  });
  if (error) throw error;
}

export async function getActiveBimestre(courseId: string): Promise<string | null> {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("bimestre_config")
    .select("bimestre")
    .eq("course_id", courseId)
    .lte("start_date", today)
    .gte("end_date", today)
    .single();
  return data?.bimestre ?? null;
}
