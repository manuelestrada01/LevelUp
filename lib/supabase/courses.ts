import { supabase } from "./client";

export interface Course {
  id: string;
  classroom_id: string;
  teacher_email: string;
  name: string;
  section: string | null;
  year: number;
  bimestre_activo: string;
  active: boolean;
  student_visible: boolean;
  created_at: string;
}

export interface CourseworkConfig {
  id: string;
  course_id: string;
  classroom_coursework_id: string;
  tipo: string;
  name: string;
}

export async function getCoursesByTeacher(teacherEmail: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("teacher_email", teacherEmail)
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Course[];
}

export async function getCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Course;
}

export async function getCourseByClassroomId(classroomId: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("classroom_id", classroomId)
    .single();
  if (error || !data) return null;
  return data as Course;
}

export async function createCourse(params: {
  classroom_id: string;
  teacher_email: string;
  name: string;
  section?: string;
  year: number;
}): Promise<Course> {
  const { data, error } = await supabase
    .from("courses")
    .insert(params)
    .select()
    .single();
  if (error) throw error;
  return data as Course;
}

export async function getVisibleCourseIds(): Promise<string[]> {
  const { data } = await supabase
    .from("courses")
    .select("id")
    .eq("student_visible", true)
    .eq("active", true);
  return (data ?? []).map((r: { id: string }) => r.id);
}

export async function updateCourse(
  id: string,
  updates: Partial<Pick<Course, "bimestre_activo" | "active" | "name" | "section" | "year" | "student_visible">>
): Promise<void> {
  const { error } = await supabase.from("courses").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deactivateCourse(id: string): Promise<void> {
  const { error } = await supabase
    .from("courses")
    .update({ active: false })
    .eq("id", id);
  if (error) throw error;
}

export async function getCourseworkConfig(courseId: string): Promise<CourseworkConfig[]> {
  const { data, error } = await supabase
    .from("coursework_config")
    .select("*")
    .eq("course_id", courseId)
    .order("name");
  if (error) throw error;
  return data as CourseworkConfig[];
}

export async function upsertCourseworkConfig(
  courseId: string,
  configs: Array<{ classroom_coursework_id: string; tipo: string; name: string }>
): Promise<void> {
  const rows = configs.map((c) => ({ course_id: courseId, ...c }));
  const { error } = await supabase
    .from("coursework_config")
    .upsert(rows, { onConflict: "course_id,classroom_coursework_id" });
  if (error) throw error;
}

export async function isTeacherOfCourse(courseId: string, teacherEmail: string): Promise<boolean> {
  const { data } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("teacher_email", teacherEmail)
    .single();
  return !!data;
}
