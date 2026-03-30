import { supabase } from "./client";

export interface Delivery {
  id: string;
  course_id: string;
  student_email: string;
  classroom_coursework_id: string;
  bimestre: string;
  tipo: string;
  submitted_at: string | null;
  due_at: string | null;
  is_early: boolean;
  status: "OK" | "LATE" | "MISSING";
  xp_base: number;
  xp_bonus: number;
  synced_at: string;
}

export interface Strike {
  id: string;
  course_id: string;
  student_email: string;
  bimestre: string;
  reason: string;
  classroom_coursework_id: string | null;
  active: boolean;
  created_at: string;
  annulled_at: string | null;
  annulled_by: string | null;
}

export interface StudentGameState {
  id: string;
  course_id: string;
  student_email: string;
  bimestre: string;
  xp_total: number;
  level: number;
  strikes_active: number;
  blocked: boolean;
  blocked_at: string | null;
  updated_at: string;
}

export async function getStudentGameState(
  courseId: string,
  studentEmail: string,
  bimestre: string
): Promise<StudentGameState | null> {
  const { data, error } = await supabase
    .from("student_game_state")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_email", studentEmail)
    .eq("bimestre", bimestre)
    .single();
  if (error || !data) return null;
  return data as StudentGameState;
}

export async function getStudentGameStateByEmail(
  studentEmail: string
): Promise<StudentGameState[]> {
  const { data, error } = await supabase
    .from("student_game_state")
    .select("*")
    .eq("student_email", studentEmail)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as StudentGameState[]) ?? [];
}

export async function getAllStudentGameStates(
  courseId: string,
  bimestre: string
): Promise<StudentGameState[]> {
  const { data, error } = await supabase
    .from("student_game_state")
    .select("*")
    .eq("course_id", courseId)
    .eq("bimestre", bimestre)
    .order("xp_total", { ascending: false });
  if (error) throw error;
  return (data as StudentGameState[]) ?? [];
}

export async function upsertGameState(
  state: Omit<StudentGameState, "id" | "updated_at">
): Promise<void> {
  const { error } = await supabase
    .from("student_game_state")
    .upsert(
      { ...state, updated_at: new Date().toISOString() },
      { onConflict: "course_id,student_email,bimestre" }
    );
  if (error) throw error;
}

export async function upsertDeliveries(
  deliveries: Omit<Delivery, "id" | "synced_at">[]
): Promise<void> {
  if (!deliveries.length) return;
  const rows = deliveries.map((d) => ({ ...d, synced_at: new Date().toISOString() }));
  const { error } = await supabase
    .from("deliveries")
    .upsert(rows, { onConflict: "course_id,student_email,classroom_coursework_id" });
  if (error) throw error;
}

export async function getDeliveriesForCourse(
  courseId: string,
  bimestre: string
): Promise<Delivery[]> {
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("course_id", courseId)
    .eq("bimestre", bimestre)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data as Delivery[]) ?? [];
}

export async function getDeliveriesForStudent(
  courseId: string,
  studentEmail: string,
  bimestre: string
): Promise<Delivery[]> {
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_email", studentEmail)
    .eq("bimestre", bimestre)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data as Delivery[]) ?? [];
}

export async function getDeliveriesByStudentEmail(
  studentEmail: string,
  limit = 10
): Promise<Delivery[]> {
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("student_email", studentEmail)
    .eq("status", "OK")
    .order("submitted_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as Delivery[]) ?? [];
}

export async function addStrike(
  strike: Omit<Strike, "id" | "annulled_at" | "annulled_by" | "created_at">
): Promise<Strike> {
  const { data, error } = await supabase
    .from("strikes")
    .insert(strike)
    .select()
    .single();
  if (error) throw error;
  return data as Strike;
}

export async function annulStrike(strikeId: string, annulledBy: string): Promise<void> {
  const { error } = await supabase
    .from("strikes")
    .update({
      active: false,
      annulled_at: new Date().toISOString(),
      annulled_by: annulledBy,
    })
    .eq("id", strikeId);
  if (error) throw error;
}

export async function getActiveStrikes(
  courseId: string,
  studentEmail: string,
  bimestre: string
): Promise<Strike[]> {
  const { data, error } = await supabase
    .from("strikes")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_email", studentEmail)
    .eq("bimestre", bimestre)
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Strike[]) ?? [];
}

export async function getAllStrikesForCourse(
  courseId: string,
  bimestre: string
): Promise<Strike[]> {
  const { data, error } = await supabase
    .from("strikes")
    .select("*")
    .eq("course_id", courseId)
    .eq("bimestre", bimestre)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Strike[]) ?? [];
}
