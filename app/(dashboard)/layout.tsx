import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Sidebar from "@/layout/Sidebar";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import MobileNav from "@/layout/MobileNav";
import { getAuthSession } from "@/lib/session";
import { getProfile } from "@/lib/supabase/profiles";
import { getCoursesByTeacher, getCoursesByIds, getVisibleCourseIds } from "@/lib/supabase/courses";
import { getStudentGameStateByEmail } from "@/lib/supabase/game";
import { detectRole } from "@/lib/google/classroom";
import { getFormativeClasses } from "@/lib/supabase/classes";
import { DEMO_EMAIL, DEMO_NAME, DEMO_CLASS, DEMO_LEVEL } from "@/lib/demo/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session as any).error === "RefreshTokenError") {
    redirect("/api/auth/force-signout");
  }

  const email = session.user.email ?? "";
  const defaultName = session.user.name?.split(" ")[0] ?? "Estudiante";

  // Demo user — render layout directly with mock data, no Supabase/Classroom calls
  if (email === DEMO_EMAIL) {
    return (
      <div className="flex h-screen flex-col overflow-hidden" style={{ background: "transparent" }}>
        <Suspense fallback={<div className="h-14 border-b border-hud-border bg-hud-base" />}>
          <Header
            courses={[{ id: "demo-course", name: "1 | Tecnología de la Representación" }]}
            studentName={DEMO_NAME.split(" ")[0]}
            studentImage={null}
          />
        </Suspense>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            studentName={DEMO_NAME.split(" ")[0]}
            studentImage={null}
            level={DEMO_LEVEL}
            formativeClassTitle={DEMO_CLASS.title}
          />
          <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-16 md:pb-0">
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

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

    const [gameStates, allClasses, visibleIds] = await Promise.all([
      getStudentGameStateByEmail(email),
      getFormativeClasses(false),
      getVisibleCourseIds(),
    ]);

    const studentCourseIds = gameStates
      .map((s) => s.course_id)
      .filter((id) => visibleIds.includes(id));

    const [courses] = await Promise.all([getCoursesByIds(studentCourseIds)]);

    const level = gameStates.length > 0 ? gameStates[0].level : 1;
    const classEntry = allClasses.find((c) => c.slug === profile.formative_class);
    const formativeClassTitle = classEntry?.title ?? profile.formative_class;

    return (
      <div className="flex h-screen flex-col overflow-hidden" style={{ background: "transparent" }}>
        <Suspense fallback={<div className="h-14 border-b border-hud-border bg-hud-base" />}>
          <Header
            courses={courses.map((c) => ({ id: c.id, name: c.name }))}
            studentName={displayName}
            studentImage={studentImage}
          />
        </Suspense>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            studentName={displayName}
            studentImage={studentImage}
            level={level}
            formativeClassTitle={formativeClassTitle}
          />
          <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-16 md:pb-0">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  // 4. First-access student — redirect to class selection
  redirect("/elegir-clase");
}
