import { supabase } from "./client";

export interface FormativeClassEntry {
  slug: string;
  title: string;
  inspiration: string;
  attributes: string[];
  description: string;
  published: boolean;
  sort_order: number;
}

export interface ClassHistoryEntry {
  id: string;
  student_email: string;
  class_slug: string;
  chosen_at: string;
  changed_from: string | null;
  formative_classes?: { title: string } | null;
}

export async function getFormativeClasses(publishedOnly = false): Promise<FormativeClassEntry[]> {
  let query = supabase.from("formative_classes").select("*").order("sort_order");
  if (publishedOnly) query = query.eq("published", true);
  const { data } = await query;
  return data ?? [];
}

export async function upsertFormativeClass(entry: FormativeClassEntry) {
  const { error } = await supabase
    .from("formative_classes")
    .upsert({ ...entry, updated_at: new Date().toISOString() }, { onConflict: "slug" });
  if (error) throw error;
}

export async function deleteFormativeClass(slug: string) {
  const { error } = await supabase.from("formative_classes").delete().eq("slug", slug);
  if (error) throw error;
}

export async function addClassHistory(
  studentEmail: string,
  classSlug: string,
  changedFrom?: string | null,
) {
  const { error } = await supabase.from("class_history").insert({
    student_email: studentEmail,
    class_slug: classSlug,
    changed_from: changedFrom ?? null,
  });
  if (error) throw error;
}

export async function getClassHistory(studentEmail: string): Promise<ClassHistoryEntry[]> {
  const { data } = await supabase
    .from("class_history")
    .select("*, formative_classes(title)")
    .eq("student_email", studentEmail)
    .order("chosen_at", { ascending: false });
  return (data ?? []) as ClassHistoryEntry[];
}
