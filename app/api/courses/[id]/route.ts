import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { getCourseById, updateCourse, deactivateCourse, isTeacherOfCourse } from "@/lib/supabase/courses";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(course);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const allowed = await isTeacherOfCourse(id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  await updateCourse(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const allowed = await isTeacherOfCourse(id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await deactivateCourse(id);
  return NextResponse.json({ ok: true });
}
