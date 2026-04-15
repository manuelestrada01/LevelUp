"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TABS = [
  { key: "resumen", label: "Resumen Académico" },
  { key: "alumnos", label: "Lista de Alumnos" },
  { key: "acciones", label: "Panel de Acciones" },
  { key: "config", label: "Configuración" },
];

interface Props {
  courseId: string;
}

export default function CourseTabNav({ courseId }: Props) {
  const searchParams = useSearchParams();
  const active = searchParams.get("tab") ?? "resumen";

  return (
    <div className="flex gap-0 border-b border-[rgba(160,125,55,0.2)]">
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={`/teacher/courses/${courseId}?tab=${key}`}
            className={`px-4 py-2.5 text-[11px] font-serif uppercase tracking-[0.18em] transition-colors ${
              isActive
                ? "border-b-2 border-[rgba(200,168,75,0.7)] text-[rgba(200,168,75,0.9)]"
                : "text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.75)]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
