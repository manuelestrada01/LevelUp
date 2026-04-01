import { supabase } from "./client";

export async function saveTeacherToken(email: string, refreshToken: string) {
  await supabase.from("teacher_tokens").upsert(
    { email, refresh_token: refreshToken, updated_at: new Date().toISOString() },
    { onConflict: "email" }
  );
}

export async function getTeacherToken(email: string): Promise<string | null> {
  const { data } = await supabase
    .from("teacher_tokens")
    .select("refresh_token")
    .eq("email", email)
    .single();
  return data?.refresh_token ?? null;
}
