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
        className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
          pathname === "/teacher" || pathname.startsWith("/teacher/config")
            ? "bg-[#c9a227]/20 text-[#c9a227]"
            : "text-[#9aab8a] hover:text-[#f5f0e8]"
        }`}
      >
        Home
      </Link>
      {courses.map((course) => {
        const isActive = pathname === `/teacher/courses/${course.id}`;
        return (
          <Link
            key={course.id}
            href={`/teacher/courses/${course.id}?tab=resumen`}
            title={course.name}
            className={`max-w-[160px] truncate rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-[#c9a227]/20 text-[#c9a227]"
                : "text-[#9aab8a] hover:text-[#f5f0e8]"
            }`}
          >
            {course.name}
          </Link>
        );
      })}
    </div>
  );
}
