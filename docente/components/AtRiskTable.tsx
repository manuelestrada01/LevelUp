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
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex items-center gap-3 mb-4"
      >
        <span className="inline-flex items-center gap-1.5 font-serif text-lg font-semibold text-[rgba(232,224,208,0.88)]">
          <AlertTriangle size={16} className="text-[#c0392b]" />
          Alumnos en Riesgo
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[rgba(192,57,43,0.2)] to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="chronicle-stone relative overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] font-serif uppercase tracking-[0.18em]" style={{ background: "rgba(160,125,55,0.07)", borderBottom: "1px solid rgba(160,125,55,0.18)" }}>
            <tr>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Email</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Bimestre</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">XP</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Strikes</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(160,125,55,0.1)]">
            {atRisk.map((s, i) => {
              const course = courses.find((c) => c.id === s.course_id);
              return (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.3, ease: "easeOut" }}
                  className="hover:bg-[rgba(160,125,55,0.04)] transition-colors"
                >
                  <td className="px-4 py-3 font-serif text-[rgba(232,224,208,0.85)]">{s.student_email}</td>
                  <td className="px-4 py-3 font-serif text-[rgba(160,125,55,0.6)]">{s.bimestre}</td>
                  <td className="px-4 py-3 font-serif font-medium text-[#c9a227]">{s.xp_total}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`flex h-5 w-5 items-center justify-center text-xs font-bold ${
                            idx < s.strikes_active
                              ? "bg-[rgba(192,57,43,0.15)] text-[#c0392b]"
                              : "bg-[rgba(232,224,208,0.05)] text-[rgba(232,224,208,0.18)]"
                          }`}
                        >
                          ✕
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`border px-2 py-0.5 text-[10px] font-serif uppercase tracking-widest font-medium ${
                        s.blocked
                          ? "border-[rgba(192,57,43,0.4)] bg-[rgba(192,57,43,0.12)] text-[#c0392b]"
                          : "border-[rgba(180,150,40,0.4)] bg-[rgba(180,150,40,0.1)] text-yellow-400"
                      }`}
                    >
                      {s.blocked ? "BLOQUEADO" : "EN RIESGO"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {course && (
                      <Link
                        href={`/teacher/courses/${course.id}?tab=alumnos`}
                        className="text-[11px] font-serif uppercase tracking-[0.15em] text-[rgba(200,168,75,0.65)] hover:text-[rgba(200,168,75,0.95)] transition-colors"
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
