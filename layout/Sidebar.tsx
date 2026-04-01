"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  LogOut,
} from "lucide-react";
interface SidebarProps {
  studentName: string;
  studentImage?: string | null;
  level: number;
  formativeClassTitle: string;
}

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/misiones", label: "Quests/Misiones", icon: Award },
  { href: "/laminas", label: "Library/Bitácora", icon: BookOpen },
  { href: "/distinciones", label: "Community/Insignias", icon: Users },
  { href: "/clases-formativas", label: "Clases Formativas", icon: GraduationCap },
];

export default function Sidebar({ studentName, studentImage, level, formativeClassTitle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[300px] flex-shrink-0 flex-col bg-[#031706] border-r border-[#1e3320]">
      {/* Student profile */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/20 border border-[#c9a227]/30 overflow-hidden">
          {studentImage ? (
            <Image src={studentImage} alt={studentName} width={48} height={48} className="h-full w-full object-cover" />
          ) : (
            <GraduationCap size={24} strokeWidth={1.5} className="text-[#c9a227]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#f5f0e8] leading-tight truncate">
            {studentName}
          </p>
          <p className="text-[10px] mt-0.5 uppercase tracking-wide text-[#9aab8a]">
            Nivel {level} · {formativeClassTitle}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col py-2 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 px-4 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                isActive
                  ? "bg-[#c9a227]/[0.12] text-[#c9a227]"
                  : "text-[#9aab8a] hover:bg-[#1e3320] hover:text-[#f5f0e8]"
              }`}
            >
              {/* Active left border */}
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a227]" />
              )}
              <Icon size={18} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#1e3320] p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-[#9aab8a] transition-colors hover:bg-[#1e3320] hover:text-[#c0392b] rounded-lg"
        >
          <LogOut size={18} strokeWidth={1.5} className="flex-shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
