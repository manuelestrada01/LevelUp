"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { StudentGameState } from "@/lib/supabase/game";
import type { Course } from "@/lib/supabase/courses";

interface Props {
  atRisk: StudentGameState[];
  courses: Course[];
}

export default function AtRiskTable({ atRisk, courses }: Props) {
  if (atRisk.length === 0) return null;

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-4 font-serif text-lg text-[#f5f0e8]"
      >
        <span className="mr-2 inline-flex items-center gap-1 text-[#c0392b]">
          <AlertTriangle size={16} />
        </span>
        Alumnos en Riesgo
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="overflow-hidden rounded-xl border border-[#1e3320]"
      >
        <table className="w-full text-sm">
          <thead className="bg-[#1a2e1c] text-left text-xs text-[#9aab8a]">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Bimestre</th>
              <th className="px-4 py-3">XP</th>
              <th className="px-4 py-3">Strikes</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3320] bg-[#0d1a0f]">
            {atRisk.map((s, i) => {
              const course = courses.find((c) => c.id === s.course_id);
              return (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.3, ease: "easeOut" }}
                  className="hover:bg-[#1a2e1c]"
                >
                  <td className="px-4 py-3 text-[#f5f0e8]">{s.student_email}</td>
                  <td className="px-4 py-3 text-[#9aab8a]">{s.bimestre}</td>
                  <td className="px-4 py-3 font-medium text-[#c9a227]">{s.xp_total}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`flex h-5 w-5 items-center justify-center rounded text-xs font-bold ${
                            idx < s.strikes_active
                              ? "bg-[#c0392b]/20 text-[#c0392b]"
                              : "bg-[#1e3320] text-[#1e3320]"
                          }`}
                        >
                          ✕
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        s.blocked
                          ? "bg-[#c0392b]/20 text-[#c0392b]"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {s.blocked ? "BLOQUEADO" : "EN RIESGO"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {course && (
                      <Link
                        href={`/teacher/courses/${course.id}?tab=alumnos`}
                        className="text-xs text-[#c9a227] hover:underline"
                      >
                        Ver curso
                      </Link>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
