import { NextResponse } from "next/server";
import { getAllActiveCourses } from "@/lib/supabase/courses";
import { getTeacherToken } from "@/lib/supabase/teacher-tokens";
import { refreshGoogleAccessToken } from "@/lib/google/token";
import { syncCourse } from "@/lib/sync/classroom";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses = await getAllActiveCourses();
  const results: { courseId: string; status: string }[] = [];

  for (const course of courses) {
    try {
      const refreshToken = await getTeacherToken(course.teacher_email);
      if (!refreshToken) {
        results.push({ courseId: course.id, status: "no_token" });
        continue;
      }
      const accessToken = await refreshGoogleAccessToken(refreshToken);
      const result = await syncCourse(course.id, accessToken, false);
      results.push({ courseId: course.id, status: result.synced ? "synced" : "skipped" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[cron] sync failed for course ${course.id}:`, msg);
      results.push({ courseId: course.id, status: `error: ${msg}` });
    }
  }

  console.log("[cron] sync-all complete:", results);
  return NextResponse.json({ results });
}
