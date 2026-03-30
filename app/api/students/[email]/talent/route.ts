import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse } from "@/lib/supabase/courses";
import { grantTalent, revokeTalent } from "@/lib/supabase/teacher";

export async function POST(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await params;
  const studentEmail = decodeURIComponent(email);

  const body = await req.json();
  const { course_id, talent_id } = body as { course_id: string; talent_id: string };

  if (!course_id || !talent_id) {
    return NextResponse.json({ error: "course_id and talent_id are required" }, { status: 400 });
  }

  const allowed = await isTeacherOfCourse(course_id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await grantTalent(course_id, studentEmail, talent_id, session.user.email);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await params;
  const studentEmail = decodeURIComponent(email);

  const body = await req.json();
  const { course_id, talent_id } = body as { course_id: string; talent_id: string };

  if (!course_id || !talent_id) {
    return NextResponse.json({ error: "course_id and talent_id are required" }, { status: 400 });
  }

  const allowed = await isTeacherOfCourse(course_id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await revokeTalent(course_id, studentEmail, talent_id);
  return NextResponse.json({ ok: true });
}
