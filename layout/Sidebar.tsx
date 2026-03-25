"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";
import { FormativeClass, CLASS_LABELS } from "@/clases-formativas/types";

interface SidebarProps {
  studentName: string;
  level: number;
  formativeClass: FormativeClass;
}

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/misiones", label: "Quests/Misiones", icon: Award },
  { href: "/laminas", label: "Library/Bitácora", icon: BookOpen },
  { href: "/distinciones", label: "Community/Insignias", icon: Users },
  { href: "/clases-formativas", label: "Clases Formativas", icon: GraduationCap },
];

export default function Sidebar({ studentName, level, formativeClass }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[300px] flex-shrink-0 flex-col bg-[#031706] border-r border-[#1e3320]">
      {/* Student profile */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/20 border border-[#c9a227]/30">
          <GraduationCap size={24} strokeWidth={1.5} className="text-[#c9a227]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#f5f0e8] leading-tight truncate">
            Estudiante
          </p>
          <p className="text-[10px] mt-0.5 uppercase tracking-wide text-[#9aab8a]">
            Nivel {level} · {CLASS_LABELS[formativeClass]}
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
    </aside>
  );
}
