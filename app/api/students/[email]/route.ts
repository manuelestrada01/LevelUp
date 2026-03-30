import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { getStudentGameStateByEmail, getDeliveriesByStudentEmail } from "@/lib/supabase/game";
import { getTalentsForStudent, getDistinctionsForStudent } from "@/lib/supabase/teacher";
import { getCoursesByTeacher } from "@/lib/supabase/courses";

export async function GET(_req: Request, { params }: { params: Promise<{ email: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await params;
  const studentEmail = decodeURIComponent(email);

  const teacherCourses = await getCoursesByTeacher(session.user.email);
  const courseIds = new Set(teacherCourses.map((c) => c.id));

  const [gameStates, recentDeliveries] = await Promise.all([
    getStudentGameStateByEmail(studentEmail),
    getDeliveriesByStudentEmail(studentEmail, 20),
  ]);

  const ownedGameStates = gameStates.filter((s) => courseIds.has(s.course_id));

  const talents = ownedGameStates.length > 0
    ? await getTalentsForStudent(ownedGameStates[0].course_id, studentEmail)
    : [];

  const distinctions = ownedGameStates.length > 0
    ? await getDistinctionsForStudent(ownedGameStates[0].course_id, studentEmail)
    : [];

  return NextResponse.json({ gameStates: ownedGameStates, recentDeliveries, talents, distinctions });
}
