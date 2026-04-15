"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Course } from "@/lib/supabase/courses";

interface Props {
  courses: Course[];
}

export default function TeacherHeaderTabs({ courses }: Props) {
  const pathname = usePathname();

  const isHome =
    pathname === "/teacher" ||
    pathname.startsWith("/teacher/config") ||
    pathname === "/teacher/courses" ||
    pathname.startsWith("/teacher/courses/") === false;

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/teacher"
        className={`border px-3 py-1.5 text-[11px] font-serif uppercase tracking-[0.15em] transition-colors ${
          pathname === "/teacher" || pathname.startsWith("/teacher/config")
            ? "border-[rgba(200,168,75,0.45)] bg-[rgba(200,168,75,0.1)] text-[rgba(200,168,75,0.9)]"
            : "border-[rgba(160,125,55,0.2)] text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.75)] hover:border-[rgba(160,125,55,0.35)]"
        }`}
      >
        Inicio
      </Link>
      {courses.map((course) => {
        const isActive = pathname === `/teacher/courses/${course.id}`;
        return (
          <Link
            key={course.id}
            href={`/teacher/courses/${course.id}?tab=resumen`}
            title={course.name}
            className={`max-w-[160px] truncate border px-3 py-1.5 text-[11px] font-serif transition-colors ${
              isActive
                ? "border-[rgba(200,168,75,0.45)] bg-[rgba(200,168,75,0.1)] text-[rgba(200,168,75,0.9)]"
                : "border-[rgba(160,125,55,0.2)] text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.75)] hover:border-[rgba(160,125,55,0.35)]"
            }`}
          >
            {course.name}
          </Link>
        );
      })}
    </div>
  );
}
