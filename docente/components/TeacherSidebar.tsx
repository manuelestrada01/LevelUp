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
    <aside className="relative flex w-16 flex-col items-center border-r border-[rgba(160,125,55,0.2)] bg-[#0c0d11] py-4">
      {/* Right gold divider line */}
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(160,125,55,0.2)] to-transparent" />

      <div className="mb-6 flex h-10 w-10 items-center justify-center border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.06)]" style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
        {teacherImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={teacherImage} alt={teacherName} className="h-10 w-10 object-cover" style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }} />
        ) : (
          <span className="text-sm font-bold font-serif text-[#c9a227]">{teacherName[0]}</span>
        )}
      </div>

      {isCourseMode ? (
        <nav className="flex flex-1 flex-col gap-1">
          <Link
            href="/teacher"
            title="Volver al inicio"
            className="flex h-10 w-10 items-center justify-center text-[rgba(160,125,55,0.4)] transition-colors hover:text-[rgba(200,168,75,0.85)]"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="mx-auto my-1 w-8 border-t border-[rgba(160,125,55,0.15)]" />
          {COURSE_TABS.map(({ tab, label, icon: Icon }) => {
            const isActive = activeTab === tab;
            return (
              <Link
                key={tab}
                href={`/teacher/courses/${courseId}?tab=${tab}`}
                title={label}
                className={`flex h-10 w-10 items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[rgba(200,168,75,0.12)] text-[rgba(200,168,75,0.9)]"
                    : "text-[rgba(160,125,55,0.4)] hover:text-[rgba(200,168,75,0.75)]"
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
                className={`flex h-10 w-10 items-center justify-center transition-colors ${
                  active
                    ? "bg-[rgba(200,168,75,0.12)] text-[rgba(200,168,75,0.9)]"
                    : "text-[rgba(160,125,55,0.4)] hover:text-[rgba(200,168,75,0.75)]"
                }`}
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </nav>
      )}

      <div className="mt-2 w-8 border-t border-[rgba(160,125,55,0.15)]" />
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        title="Cerrar sesión"
        className="mt-2 flex h-10 w-10 items-center justify-center text-[rgba(192,57,43,0.45)] transition-colors hover:text-[#c0392b]"
      >
        <LogOut size={18} />
      </button>
    </aside>
  );
}
