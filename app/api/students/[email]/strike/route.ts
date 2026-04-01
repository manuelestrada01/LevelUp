import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse, getCourseById } from "@/lib/supabase/courses";
import { addStrike, annulStrike, getActiveStrikes, getStudentGameState, upsertGameState } from "@/lib/supabase/game";
import { logException } from "@/lib/supabase/teacher";

export async function POST(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await params;
  const studentEmail = decodeURIComponent(email);

  const body = await req.json();
  const { course_id, reason, notes } = body as {
    course_id: string;
    reason: string;
    notes?: string;
  };

  if (!course_id || !reason) {
    return NextResponse.json({ error: "course_id and reason are required" }, { status: 400 });
  }

  const allowed = await isTeacherOfCourse(course_id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const course = await getCourseById(course_id);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const strike = await addStrike({
    course_id,
    student_email: studentEmail,
    bimestre: course.bimestre_activo,
    reason,
    classroom_coursework_id: null,
    active: true,
  });

  // Actualizar game state con el nuevo conteo de strikes
  const [freshStrikes, gameState] = await Promise.all([
    getActiveStrikes(course_id, studentEmail, course.bimestre_activo),
    getStudentGameState(course_id, studentEmail, course.bimestre_activo),
  ]);
  if (gameState) {
    const blocked = freshStrikes.length >= 3;
    await upsertGameState({
      ...gameState,
      strikes_active: freshStrikes.length,
      blocked,
      blocked_at: blocked && !gameState.blocked ? new Date().toISOString() : gameState.blocked_at,
      xp_total: blocked ? 0 : gameState.xp_total,
      level: blocked ? 1 : gameState.level,
    });
  }

  await logException({
    course_id,
    student_email: studentEmail,
    type: "manual_xp",
    notes: notes ?? `Strike manual forzado: ${reason}`,
    value: null,
    created_by: session.user.email,
  });

  return NextResponse.json(strike, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await params;
  const studentEmail = decodeURIComponent(email);

  const body = await req.json();
  const { strike_id, course_id, notes } = body as {
    strike_id: string;
    course_id: string;
    notes?: string;
  };

  if (!strike_id || !course_id) {
    return NextResponse.json({ error: "strike_id and course_id are required" }, { status: 400 });
  }

  const allowed = await isTeacherOfCourse(course_id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await annulStrike(strike_id, session.user.email);

  // Actualizar game state con el nuevo conteo de strikes
  const course = await getCourseById(course_id);
  if (course) {
    const [freshStrikes, gameState] = await Promise.all([
      getActiveStrikes(course_id, studentEmail, course.bimestre_activo),
      getStudentGameState(course_id, studentEmail, course.bimestre_activo),
    ]);
    if (gameState) {
      await upsertGameState({
        ...gameState,
        strikes_active: freshStrikes.length,
      });
    }
  }

  await logException({
    course_id,
    student_email: studentEmail,
    type: "annul_strike",
    notes: notes ?? "Strike anulado por docente",
    value: null,
    created_by: session.user.email,
  });

  return NextResponse.json({ ok: true });
}
