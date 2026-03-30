import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { getCourseById, getCourseworkConfig, upsertCourseworkConfig, isTeacherOfCourse } from "@/lib/supabase/courses";
import { getCourseWorkList } from "@/lib/google/classroom";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const allowed = await isTeacherOfCourse(id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const course = await getCourseById(id);
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [classroomWork, savedConfigs] = await Promise.all([
    getCourseWorkList(session.accessToken, course.classroom_id),
    getCourseworkConfig(id),
  ]);

  const configMap = new Map(savedConfigs.map((c) => [c.classroom_coursework_id, c]));

  const items = classroomWork.map((cw) => ({
    classroom_coursework_id: cw.id,
    title: cw.title,
    tipo: configMap.get(cw.id!)?.tipo ?? null,
  }));

  return NextResponse.json(items);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const allowed = await isTeacherOfCourse(id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const course = await getCourseById(id);
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const configs = body as Array<{ classroom_coursework_id: string; tipo: string; name: string }>;

  if (!Array.isArray(configs)) {
    return NextResponse.json({ error: "Body must be an array" }, { status: 400 });
  }

  await upsertCourseworkConfig(id, configs);
  return NextResponse.json({ ok: true });
}
