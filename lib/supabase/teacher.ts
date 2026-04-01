import { supabase } from "./client";

export interface TalentGrant {
  id: string;
  course_id: string;
  student_email: string;
  talent_id: string;
  granted_by: string;
  granted_at: string;
}

export interface DistinctionGrant {
  id: string;
  course_id: string;
  student_email: string;
  distinction_id: string;
  granted_by: string;
  granted_at: string;
}

export type ExceptionType = "force_unlock" | "annul_strike" | "enable_recovery" | "manual_xp";

export interface TeacherException {
  id: string;
  course_id: string;
  student_email: string;
  type: ExceptionType;
  notes: string | null;
  value: number | null;
  created_by: string;
  created_at: string;
}

export async function getTalentsForStudent(
  courseId: string,
  studentEmail: string
): Promise<TalentGrant[]> {
  const { data, error } = await supabase
    .from("talent_grants")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_email", studentEmail);
  if (error) throw error;
  return (data as TalentGrant[]) ?? [];
}

export async function grantTalent(
  courseId: string,
  studentEmail: string,
  talentId: string,
  grantedBy: string
): Promise<void> {
  const { error } = await supabase.from("talent_grants").upsert(
    {
      course_id: courseId,
      student_email: studentEmail,
      talent_id: talentId,
      granted_by: grantedBy,
    },
    { onConflict: "course_id,student_email,talent_id" }
  );
  if (error) throw error;
}

export async function revokeTalent(
  courseId: string,
  studentEmail: string,
  talentId: string
): Promise<void> {
  const { error } = await supabase
    .from("talent_grants")
    .delete()
    .eq("course_id", courseId)
    .eq("student_email", studentEmail)
    .eq("talent_id", talentId);
  if (error) throw error;
}

export async function grantDistinction(
  courseId: string,
  studentEmail: string,
  distinctionId: string,
  grantedBy: string
): Promise<void> {
  const { error } = await supabase.from("distinction_grants").insert({
    course_id: courseId,
    student_email: studentEmail,
    distinction_id: distinctionId,
    granted_by: grantedBy,
  });
  if (error) throw error;
}

export async function getDistinctionsForStudent(
  courseId: string,
  studentEmail: string
): Promise<DistinctionGrant[]> {
  const { data, error } = await supabase
    .from("distinction_grants")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_email", studentEmail)
    .order("granted_at", { ascending: false });
  if (error) throw error;
  return (data as DistinctionGrant[]) ?? [];
}

export async function getDistinctionsForStudentByCourses(
  studentEmail: string,
  courseIds: string[]
): Promise<DistinctionGrant[]> {
  if (!courseIds.length) return [];
  const { data, error } = await supabase
    .from("distinction_grants")
    .select("*")
    .eq("student_email", studentEmail)
    .in("course_id", courseIds)
    .order("granted_at", { ascending: false });
  if (error) throw error;
  return (data as DistinctionGrant[]) ?? [];
}

export async function logException(
  exception: Omit<TeacherException, "id" | "created_at">
): Promise<void> {
  const { error } = await supabase.from("teacher_exceptions").insert(exception);
  if (error) throw error;
}

export async function getExceptionsForStudent(
  courseId: string,
  studentEmail: string
): Promise<TeacherException[]> {
  const { data, error } = await supabase
    .from("teacher_exceptions")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_email", studentEmail)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as TeacherException[]) ?? [];
}

export async function getExceptionById(id: string): Promise<TeacherException | null> {
  const { data, error } = await supabase
    .from("teacher_exceptions")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as TeacherException;
}

export async function updateExceptionNotes(id: string, notes: string): Promise<void> {
  const { error } = await supabase
    .from("teacher_exceptions")
    .update({ notes })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteException(id: string): Promise<void> {
  const { error } = await supabase
    .from("teacher_exceptions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
