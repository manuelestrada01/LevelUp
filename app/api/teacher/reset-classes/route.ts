import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse } from "@/lib/supabase/courses";
import { resetFormativeClasses } from "@/lib/supabase/profiles";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { courseId } = body as { courseId?: string };

  if (courseId) {
    const allowed = await isTeacherOfCourse(courseId, session.user.email);
    if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: states } = await supabase
      .from("student_game_state")
      .select("student_email")
      .eq("course_id", courseId);

    const emails = [...new Set((states ?? []).map((s: { student_email: string }) => s.student_email))];
    const count = await resetFormativeClasses(emails);
    return NextResponse.json({ ok: true, count });
  }

  // Global reset — verify the caller owns at least one course
  const { data: courses } = await supabase
    .from("courses")
    .select("id")
    .eq("teacher_email", session.user.email)
    .limit(1);

  if (!courses?.length) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const count = await resetFormativeClasses();
  return NextResponse.json({ ok: true, count });
}
