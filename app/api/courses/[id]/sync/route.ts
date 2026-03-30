import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse } from "@/lib/supabase/courses";
import { syncCourse } from "@/lib/sync/classroom";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const allowed = await isTeacherOfCourse(id, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const force = body?.force === true;

  const result = await syncCourse(id, session.accessToken, force);
  return NextResponse.json(result);
}
