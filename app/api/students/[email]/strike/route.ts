import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse } from "@/lib/supabase/courses";
import { addStrike, annulStrike } from "@/lib/supabase/game";
import { logException } from "@/lib/supabase/teacher";

export async function POST(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await params;
  const studentEmail = decodeURIComponent(email);

  const body = await req.json();
  const { course_id, bimestre, reason, notes } = body as {
    course_id: string;
    bimestre: string;
    reason: string;
    notes?: string;
  };

  if (!course_id || !bimestre || !reason) {
    return NextResponse.json({ error: "course_id, bimestre, reason are required" }, { status: 400 });
  }

  const allowed = await isTeacherOfCourse(course_id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const strike = await addStrike({
    course_id,
    student_email: studentEmail,
    bimestre,
    reason,
    classroom_coursework_id: null,
    active: true,
  });

  await logException({
    course_id,
    student_email: studentEmail,
    type: "annul_strike",
    notes: notes ?? `Strike manual: ${reason}`,
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
