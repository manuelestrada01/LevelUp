import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { getCoursesByTeacher, createCourse, getCourseByClassroomId } from "@/lib/supabase/courses";
import { getCourses, detectRole } from "@/lib/google/classroom";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await getCoursesByTeacher(session.user.email);
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await detectRole(session.accessToken);
  if (role !== "teacher") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { classroom_id, year } = body as { classroom_id: string; year: number };

  if (!classroom_id || !year) {
    return NextResponse.json({ error: "classroom_id and year are required" }, { status: 400 });
  }

  const existing = await getCourseByClassroomId(classroom_id);
  if (existing) return NextResponse.json({ error: "Course already registered" }, { status: 409 });

  const classroomCourses = await getCourses(session.accessToken, "teacher");
  const found = classroomCourses.find((c) => c.id === classroom_id);
  if (!found) return NextResponse.json({ error: "Course not found in Classroom" }, { status: 404 });

  const course = await createCourse({
    classroom_id,
    teacher_email: session.user.email,
    name: found.name ?? classroom_id,
    section: found.section ?? undefined,
    year,
  });

  return NextResponse.json(course, { status: 201 });
}
