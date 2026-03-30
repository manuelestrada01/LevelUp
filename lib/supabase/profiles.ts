import { supabase } from "./client";
import { FormativeClass } from "@/clases-formativas/types";

export interface StudentProfile {
  email: string;
  formative_class: FormativeClass;
  display_name: string | null;
  created_at: string;
}

export async function getProfile(email: string): Promise<StudentProfile | null> {
  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data as StudentProfile;
}

export async function saveProfile(
  email: string,
  formativeClass: FormativeClass,
  displayName?: string
): Promise<void> {
  await supabase.from("student_profiles").upsert(
    {
      email,
      formative_class: formativeClass,
      ...(displayName ? { display_name: displayName } : {}),
    },
    { onConflict: "email" }
  );
}

export async function updateDisplayName(email: string, displayName: string): Promise<void> {
  await supabase
    .from("student_profiles")
    .update({ display_name: displayName })
    .eq("email", email);
}
