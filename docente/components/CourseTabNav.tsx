"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { key: "panel", label: "Panel Docente" },
  { key: "resumen", label: "Resumen Académico" },
  { key: "alumnos", label: "Lista de Alumnos" },
  { key: "config", label: "Configuración" },
];

interface Props {
  courseId: string;
}

export default function CourseTabNav({ courseId }: Props) {
  const searchParams = useSearchParams();
  const active = searchParams.get("tab") ?? "panel";

  return (
    <div className="flex gap-1 border-b border-[#1e3320]">
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={`/teacher/courses/${courseId}?tab=${key}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-[#c9a227] text-[#c9a227]"
                : "text-[#9aab8a] hover:text-[#f5f0e8]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
