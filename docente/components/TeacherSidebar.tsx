"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, Settings2, LogOut } from "lucide-react";

const NAV = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/courses", label: "Cursos", icon: BookOpen },
  { href: "/teacher/config", label: "Configuración Macro", icon: Settings2 },
];

interface Props {
  teacherName: string;
  teacherImage: string | null;
}

export default function TeacherSidebar({ teacherName, teacherImage }: Props) {
  const pathname = usePathname();

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

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/teacher" && pathname.startsWith(href));
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
