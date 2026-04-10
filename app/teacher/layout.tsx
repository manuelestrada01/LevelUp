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
    <div className="flex h-screen overflow-hidden bg-[#0d1a0f]">
      <Suspense fallback={<div className="w-16 shrink-0 border-r border-[#1e3320] bg-[#0d1a0f]" />}>
        <TeacherSidebar teacherName={teacherName} teacherImage={teacherImage} />
      </Suspense>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-[#1e3320] bg-[#0d1a0f] px-6 py-4">
          <span className="shrink-0 font-serif text-lg tracking-wide text-[#c9a227]">
            Visor Académico — Panel Docente
          </span>
          <Suspense fallback={null}>
            <TeacherHeaderTabs courses={courses} />
          </Suspense>
          <div className="flex shrink-0 items-center gap-3">
            {teacherImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={teacherImage} alt={teacherName} className="h-8 w-8 rounded-full" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3320] text-sm font-medium text-[#c9a227]">
                {teacherName[0]}
              </div>
            )}
            <span className="text-sm text-[#9aab8a]">{teacherName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
