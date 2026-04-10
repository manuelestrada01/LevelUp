import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllActiveCourses } from "@/lib/supabase/courses";
import { getTeacherToken } from "@/lib/supabase/teacher-tokens";
import { refreshGoogleAccessToken } from "@/lib/google/token";
import { syncCourse } from "@/lib/sync/classroom";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses = await getAllActiveCourses();

  for (const course of courses) {
    try {
      const refreshToken = await getTeacherToken(course.teacher_email);
      if (!refreshToken) continue;
      const accessToken = await refreshGoogleAccessToken(refreshToken);
      await syncCourse(course.id, accessToken, false);
    } catch (e) {
      console.error(`[sync/student] failed for course ${course.id}:`, e);
    }
  }

  return NextResponse.json({ ok: true });
}
