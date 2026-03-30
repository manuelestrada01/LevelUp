import { auth } from "@/auth";
import { isTeacherOfCourse } from "@/lib/supabase/courses";
import { getBimestreConfig, upsertBimestreConfig, BimestreConfigEntry } from "@/lib/supabase/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { courseId } = await params;
  const allowed = await isTeacherOfCourse(courseId, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  const data = await getBimestreConfig(courseId);
  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { courseId } = await params;
  const allowed = await isTeacherOfCourse(courseId, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  const entries: BimestreConfigEntry[] = await req.json();
  await upsertBimestreConfig(entries.map((e) => ({ ...e, course_id: courseId })));
  return NextResponse.json({ ok: true });
}
