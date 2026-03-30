import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/Sidebar";
import Header from "@/layout/Header";
import { getAuthSession } from "@/lib/session";
import { getProfile } from "@/lib/supabase/profiles";
import { getCoursesByTeacher } from "@/lib/supabase/courses";
import { getStudentGameStateByEmail } from "@/lib/supabase/game";
import { detectRole } from "@/lib/google/classroom";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session as any).error === "RefreshTokenError") {
    redirect("/api/auth/signout");
  }

  const email = session.user.email ?? "";
  const defaultName = session.user.name?.split(" ")[0] ?? "Estudiante";

  // 1. Check Supabase courses table AND Classroom API concurrently
  const authSession = await getAuthSession();

  const [teacherCourses] = await Promise.all([
    getCoursesByTeacher(email),
  ]);

  if (teacherCourses.length > 0) {
    redirect("/teacher");
  }

  // 2. Always detect role via Classroom API — catches teachers without registered courses yet
  if (authSession) {
    let role: "teacher" | "student" | null = null;
    try {
      role = await detectRole(authSession.accessToken);
    } catch {
      // Classroom API unavailable — fall through to student flow
    }
    if (role === "teacher") redirect("/teacher");
  }

  // 3. Check student profile
  const profile = await getProfile(email);
  if (profile) {
    const displayName = profile.display_name ?? defaultName;
    const studentImage = session.user.image ?? null;

    const gameStates = await getStudentGameStateByEmail(email);
    const level = gameStates.length > 0 ? gameStates[0].level : 1;

    return (
      <div className="flex h-screen flex-col overflow-hidden bg-[#031706]">
        <Header
          activeSubject="rep1"
          studentName={displayName}
          studentImage={studentImage}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            studentName={displayName}
            studentImage={studentImage}
            level={level}
            formativeClass={profile.formative_class}
          />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    );
  }

  // 4. First-access student — redirect to class selection
  redirect("/elegir-clase");
}
