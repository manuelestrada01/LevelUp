import { auth } from "@/auth";
import { logException } from "@/lib/supabase/teacher";
import { upsertGameState, getStudentGameStateByEmail } from "@/lib/supabase/game";
import { calcNivelFromXp } from "@/xp/engine";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { email } = await params;
  const studentEmail = decodeURIComponent(email);
  const { courseId, bimestre, xp, notes } = await req.json();

  const states = await getStudentGameStateByEmail(studentEmail);
  const state = states.find((s) => s.course_id === courseId && s.bimestre === bimestre);
  if (!state) return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });

  const newXp = state.xp_total + xp;
  await upsertGameState({
    ...state,
    xp_total: newXp,
    level: calcNivelFromXp(newXp),
  });

  await logException({
    course_id: courseId,
    student_email: studentEmail,
    type: "manual_xp",
    notes: notes ?? `Evento: +${xp} XP`,
    value: xp,
    created_by: session.user.email,
  });

  return NextResponse.json({ ok: true });
}
