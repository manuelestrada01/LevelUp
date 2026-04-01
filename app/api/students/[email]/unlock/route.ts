import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse } from "@/lib/supabase/courses";
import { upsertGameState, getStudentGameState, getActiveStrikes, annulStrike } from "@/lib/supabase/game";
import { logException } from "@/lib/supabase/teacher";
import { getCourseById } from "@/lib/supabase/courses";

export async function POST(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await params;
  const studentEmail = decodeURIComponent(email);

  const body = await req.json();
  const { course_id, notes } = body as { course_id: string; notes?: string };

  if (!course_id) {
    return NextResponse.json({ error: "course_id is required" }, { status: 400 });
  }

  const allowed = await isTeacherOfCourse(course_id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const course = await getCourseById(course_id);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const gameState = await getStudentGameState(course_id, studentEmail, course.bimestre_activo);
  if (!gameState) return NextResponse.json({ error: "No game state found" }, { status: 404 });

  // Anular todos los strikes activos (el desbloqueo implica resetear los strikes)
  const activeStrikes = await getActiveStrikes(course_id, studentEmail, course.bimestre_activo);
  await Promise.all(activeStrikes.map((s) => annulStrike(s.id, session.user.email)));

  await upsertGameState({
    course_id,
    student_email: studentEmail,
    bimestre: course.bimestre_activo,
    xp_total: gameState.xp_total,
    level: gameState.level,
    strikes_active: 0,
    blocked: false,
    blocked_at: null,
  });

  await logException({
    course_id,
    student_email: studentEmail,
    type: "force_unlock",
    notes: notes ?? "Desbloqueo forzado por docente",
    value: null,
    created_by: session.user.email,
  });

  return NextResponse.json({ ok: true });
}
