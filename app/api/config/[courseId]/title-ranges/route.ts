import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse } from "@/lib/supabase/courses";
import { getTitleRanges, upsertTitleRanges } from "@/lib/supabase/config";
import type { TitleRange } from "@/lib/supabase/config";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;
  const allowed = await isTeacherOfCourse(courseId, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ranges = await getTitleRanges(courseId);
  return NextResponse.json(ranges);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;
  const allowed = await isTeacherOfCourse(courseId, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ranges = (await req.json()) as TitleRange[];
  try {
    await upsertTitleRanges(courseId, ranges);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
