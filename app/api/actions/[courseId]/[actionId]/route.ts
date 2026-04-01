import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse } from "@/lib/supabase/courses";
import { supabase } from "@/lib/supabase/client";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; actionId: string }> }
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId, actionId } = await params;
  const allowed = await isTeacherOfCourse(courseId, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as {
    title?: string;
    description?: string;
    xp_value?: number;
    talent_slug?: string;
    affected_emails?: string[];
  };

  const { error } = await supabase
    .from("teacher_action_groups")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", actionId)
    .eq("course_id", courseId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
