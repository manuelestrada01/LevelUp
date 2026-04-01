"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  ArrowLeft,
  BarChart2,
  Users,
  Zap,
  Settings,
} from "lucide-react";

const HOME_NAV = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/teacher/courses", label: "Configuración de Cursos", icon: BookOpen },
  { href: "/teacher/config", label: "Configuración Macro", icon: Settings },
];

const COURSE_TABS = [
  { tab: "resumen", label: "Resumen Académico", icon: BarChart2 },
  { tab: "alumnos", label: "Lista de Alumnos", icon: Users },
  { tab: "acciones", label: "Panel de Acciones", icon: Zap },
  { tab: "config", label: "Configuración de Curso", icon: Settings },
];

interface Props {
  teacherName: string;
  teacherImage: string | null;
}

export default function TeacherSidebar({ teacherName, teacherImage }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "resumen";

  const courseMatch = pathname.match(/^\/teacher\/courses\/([^/]+)$/);
  const courseId = courseMatch?.[1];
  const isCourseMode = !!courseId;

  return (
    <aside className="flex w-16 flex-col items-center border-r border-[#1e3320] bg-[#0d1a0f] py-4">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3320]">
        {teacherImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={teacherImage} alt={teacherName} className="h-10 w-10 rounded-full" />
        ) : (
          <span className="text-sm font-bold text-[#c9a227]">{teacherName[0]}</span>
        )}
      </div>

      {isCourseMode ? (
        <nav className="flex flex-1 flex-col gap-1">
          <Link
            href="/teacher"
            title="Volver al inicio"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#9aab8a] transition-colors hover:bg-[#1e3320] hover:text-[#f5f0e8]"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="mx-auto my-1 w-8 border-t border-[#1e3320]" />
          {COURSE_TABS.map(({ tab, label, icon: Icon }) => {
            const isActive = activeTab === tab;
            return (
              <Link
                key={tab}
                href={`/teacher/courses/${courseId}?tab=${tab}`}
                title={label}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#c9a227]/20 text-[#c9a227]"
                    : "text-[#9aab8a] hover:bg-[#1e3320] hover:text-[#f5f0e8]"
                }`}
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </nav>
      ) : (
        <nav className="flex flex-1 flex-col gap-1">
          {HOME_NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : href !== "/teacher" && pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? "bg-[#c9a227]/20 text-[#c9a227]"
                    : "text-[#9aab8a] hover:bg-[#1e3320] hover:text-[#f5f0e8]"
                }`}
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </nav>
      )}

      <div className="mt-2 w-8 border-t border-[#1e3320]" />
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        title="Cerrar sesión"
        className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg text-[#c0392b]/60 transition-colors hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
      >
        <LogOut size={18} />
      </button>
    </aside>
  );
}
