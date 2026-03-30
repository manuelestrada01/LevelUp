import { auth } from "@/auth";
import { isTeacherOfCourse, updateCourse } from "@/lib/supabase/courses";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const allowed = await isTeacherOfCourse(id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  const { student_visible } = await req.json();
  await updateCourse(id, { student_visible });
  return NextResponse.json({ ok: true });
}
