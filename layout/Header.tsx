"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Subject } from "@/dashboard/types";

interface HeaderProps {
  activeSubject: Subject;
  studentName: string;
  studentImage?: string | null;
}

const SUBJECT_TABS: { id: Subject; label: string; href: string }[] = [
  { id: "rep1", label: "Tecnología de la Rep. 1", href: "/" },
  { id: "rep2", label: "Tecnología de la Rep. 2", href: "/rep2" },
  { id: "rep3", label: "Tecnología de la Rep. 3", href: "/rep3" },
];

export default function Header({ activeSubject, studentName, studentImage }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-[#1e3320] bg-[#031706] px-6 shadow-[0_8px_20px_0px_rgba(0,0,0,0.6)]" style={{zIndex: 10, position: 'relative'}}>
      {/* Logo */}
      <div className="flex items-center gap-6">
        <span className="font-serif text-xl font-semibold text-[#c9a227] tracking-tight" style={{ textShadow: "0 0 6px rgba(201,162,39,1), 0 0 16px rgba(201,162,39,0.85), 0 0 30px rgba(201,162,39,0.35)" }}>
          Visor Académico
        </span>

        {/* Subject tabs */}
        <nav className="flex items-center gap-1">
          {SUBJECT_TABS.map(({ id, label, href }) => {
            const isActive = id === activeSubject;
            return (
              <Link
                key={id}
                href={href}
                className={`relative px-3 py-4 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#c9a227]"
                    : "text-[#9aab8a] hover:text-[#f5f0e8]"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c9a227] rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#9aab8a] hover:bg-[#1a2e1c] hover:text-[#f5f0e8] transition-colors">
          <Bell size={16} strokeWidth={1.5} />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a227]/20 border border-[#c9a227]/40 overflow-hidden">
          {studentImage ? (
            <Image src={studentImage} alt={studentName} width={32} height={32} className="h-full w-full object-cover" />
          ) : (
            <span className="text-[#c9a227] text-sm font-semibold font-serif">
              {studentName.charAt(0)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
