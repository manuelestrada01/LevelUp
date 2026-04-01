import { supabase } from "./client";

export interface StudentProfile {
  email: string;
  formative_class: string;
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
  formativeClass: string,
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

export async function getProfilesMap(emails: string[]): Promise<Map<string, string>> {
  if (!emails.length) return new Map();
  const { data } = await supabase
    .from("student_profiles")
    .select("email, display_name")
    .in("email", emails);
  const map = new Map<string, string>();
  for (const row of data ?? []) {
    if (row.display_name) map.set(row.email, row.display_name);
  }
  return map;
}

export interface StudentProfileFull {
  email: string;
  display_name: string | null;
  formative_class: string | null;
}

export async function syncDisplayNamesFromRoster(
  students: { email: string; displayName: string }[]
): Promise<void> {
  if (!students.length) return;
  // Only update profiles that already exist (student chose their class).
  // Never insert here — profile creation belongs to the student login flow.
  await Promise.all(
    students.map(({ email, displayName }) =>
      supabase.from("student_profiles").update({ display_name: displayName }).eq("email", email)
    )
  );
}

export async function resetFormativeClasses(emails?: string[]): Promise<number> {
  if (emails !== undefined && !emails.length) return 0;

  let query = supabase
    .from("student_profiles")
    .update({ formative_class: null })
    .not("formative_class", "is", null);

  if (emails !== undefined) {
    query = query.in("email", emails);
  }

  const { data, error } = await query.select("email");
  if (error) throw error;
  return data?.length ?? 0;
}

export async function getProfilesFull(
  emails: string[]
): Promise<Map<string, StudentProfileFull>> {
  if (!emails.length) return new Map();
  const { data } = await supabase
    .from("student_profiles")
    .select("email, display_name, formative_class")
    .in("email", emails);
  const map = new Map<string, StudentProfileFull>();
  for (const row of data ?? []) {
    map.set(row.email, {
      email: row.email,
      display_name: row.display_name ?? null,
      formative_class: row.formative_class ?? null,
    });
  }
  return map;
}
