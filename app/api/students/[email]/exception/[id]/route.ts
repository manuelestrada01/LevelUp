import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { getCoursesByTeacher } from "@/lib/supabase/courses";
import {
  getExceptionById,
  updateExceptionNotes,
  deleteException,
} from "@/lib/supabase/teacher";
import {
  getStudentGameState,
  upsertGameState,
} from "@/lib/supabase/game";
import { calcNivelFromXp } from "@/xp/engine";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ email: string; id: string }> }
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const exception = await getExceptionById(id);
  if (!exception) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const teacherCourses = await getCoursesByTeacher(session.user.email);
  if (!teacherCourses.some((c) => c.id === exception.course_id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { notes } = await req.json();
  await updateExceptionNotes(id, notes ?? "");
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ email: string; id: string }> }
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email: studentEmail, id } = await params;
  const decodedEmail = decodeURIComponent(studentEmail);

  const exception = await getExceptionById(id);
  if (!exception) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const teacherCourses = await getCoursesByTeacher(session.user.email);
  const course = teacherCourses.find((c) => c.id === exception.course_id);
  if (!course) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // For manual_xp: subtract the XP from game state before deleting
  if (exception.type === "manual_xp" && exception.value && exception.value > 0) {
    const gameState = await getStudentGameState(
      exception.course_id,
      decodedEmail,
      course.bimestre_activo
    );
    if (gameState) {
      const newXp = Math.max(0, gameState.xp_total - exception.value);
      await upsertGameState({
        ...gameState,
        xp_total: newXp,
        level: calcNivelFromXp(newXp),
      });
    }
  }

  await deleteException(id);
  return NextResponse.json({ ok: true });
}
