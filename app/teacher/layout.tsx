import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCoursesByTeacher } from "@/lib/supabase/courses";
import { getAuthSession } from "@/lib/session";
import { detectRole } from "@/lib/google/classroom";
import TeacherSidebar from "@/docente/components/TeacherSidebar";
import TeacherHeaderTabs from "@/docente/components/TeacherHeaderTabs";
import Footer from "@/layout/Footer";
import { Suspense } from "react";

export default async function TeacherLayout({
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

  const courses = await getCoursesByTeacher(email);
  if (courses.length === 0) {
    const authSession = await getAuthSession();
    if (!authSession) redirect("/");

    let role: "teacher" | "student" | null = null;
    try {
      role = await detectRole(authSession.accessToken);
    } catch {
      redirect("/");
    }
    if (role !== "teacher") redirect("/");
  }

  const teacherName = session.user.name?.split(" ")[0] ?? "Docente";
  const teacherImage = session.user.image ?? null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0c0d11]">
      <Suspense fallback={<div className="w-16 shrink-0 border-r border-[#1e3320] bg-[#0d1a0f]" />}>
        <TeacherSidebar teacherName={teacherName} teacherImage={teacherImage} />
      </Suspense>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="relative flex items-center justify-between bg-[#0c0d11] px-6 py-4">
          {/* Top glow line */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,168,75,0.35)] to-transparent" />
          {/* Bottom gold divider */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.45)] to-transparent" />

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden md:block h-px w-5 bg-[rgba(160,125,55,0.4)]" />
            <span className="font-serif text-base uppercase tracking-[0.22em] text-[rgba(200,168,75,0.85)]">
              Panel Docente
            </span>
            <div className="hidden md:block h-px w-5 bg-[rgba(160,125,55,0.4)]" />
          </div>

          <Suspense fallback={null}>
            <TeacherHeaderTabs courses={courses} />
          </Suspense>

          <div className="flex shrink-0 items-center gap-3">
            {teacherImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={teacherImage} alt={teacherName} className="h-8 w-8 border border-[rgba(160,125,55,0.3)]" style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }} />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center border border-[rgba(160,125,55,0.3)] bg-[rgba(160,125,55,0.06)] text-sm font-medium text-[#c9a227]" style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
                {teacherName[0]}
              </div>
            )}
            <span className="hidden md:block text-sm font-serif text-[rgba(200,168,75,0.65)]">{teacherName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
