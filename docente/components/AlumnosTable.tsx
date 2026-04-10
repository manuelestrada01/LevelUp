"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, FileText, AlertTriangle } from "lucide-react";
import StrikeManager from "./StrikeManager";
import type { Strike } from "@/lib/supabase/game";

export type AlumnoRow = {
  email: string;
  displayName: string;
  level: number;
  levelTitle: string | null;
  levelRole: string | null;
  xpTotal: number;
  formativeTitle: string;
  strikesActive: number;
  blocked: boolean;
  activeStrikes: Strike[];
};

interface Props {
  rows: AlumnoRow[];
  courseId: string;
  bimestre: string;
}

export default function AlumnosTable({ rows, courseId, bimestre }: Props) {
  const [query, setQuery] = useState("");
  const [onlyWithStrikes, setOnlyWithStrikes] = useState(false);

  const filtered = rows.filter((r) => {
    if (onlyWithStrikes && r.strikesActive === 0) return false;
    if (query.trim()) {
      return (
        r.displayName.toLowerCase().includes(query.toLowerCase()) ||
        r.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aab8a]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar alumno por nombre o mail…"
            className="w-full rounded-lg border border-[#1e3320] bg-[#0d1a0f] py-2 pl-8 pr-3 text-sm text-[#f5f0e8] placeholder-[#9aab8a] outline-none focus:border-[#c9a227]/60"
          />
        </div>
        <button
          onClick={() => setOnlyWithStrikes((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            onlyWithStrikes
              ? "border-[#c0392b]/60 bg-[#c0392b]/20 text-[#c0392b]"
              : "border-[#1e3320] bg-[#0d1a0f] text-[#9aab8a] hover:border-[#c0392b]/40 hover:text-[#c0392b]"
          }`}
        >
          <AlertTriangle size={13} />
          Con strikes
          {onlyWithStrikes && (
            <span className="ml-1 rounded bg-[#c0392b]/30 px-1.5 py-0.5 text-[10px]">
              {filtered.length}
            </span>
          )}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#1e3320] p-12 text-center">
          <p className="text-[#9aab8a]">
            {onlyWithStrikes && !query
              ? "Ningún alumno tiene strikes en este bimestre."
              : query
              ? "Sin resultados para esa búsqueda."
              : "No hay datos para el bimestre seleccionado."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#1e3320]">
          <table className="w-full text-sm">
            <thead className="bg-[#1a2e1c] text-left text-xs text-[#9aab8a]">
              <tr>
                <th className="px-4 py-3">Alumno</th>
                <th className="px-4 py-3">Mail</th>
                <th className="px-4 py-3">Nv.</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Clase</th>
                <th className="px-4 py-3">Strikes</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3320] bg-[#0d1a0f]">
              {filtered.map((row) => (
                <tr key={row.email} className="hover:bg-[#1a2e1c]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/teacher/students/${encodeURIComponent(row.email)}`}
                      className="font-medium text-[#f5f0e8] hover:text-[#c9a227]"
                    >
                      {row.displayName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#9aab8a]">{row.email}</td>
                  <td className="px-4 py-3 text-[#f5f0e8]">{row.level}</td>
                  <td className="px-4 py-3 text-xs text-[#f5f0e8]">{row.levelTitle ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-[#9aab8a]">{row.levelRole ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-[#c9a227]">{row.xpTotal}</td>
                  <td className="px-4 py-3 text-xs text-[#9aab8a]">{row.formativeTitle}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span
                          key={i}
                          className={`flex h-5 w-5 items-center justify-center rounded text-xs font-bold ${
                            i < row.strikesActive
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
                        row.blocked
                          ? "bg-[#c0392b]/20 text-[#c0392b]"
                          : row.strikesActive >= 2
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-[#1e3320] text-[#8fbc8f]"
                      }`}
                    >
                      {row.blocked ? "BLOQUEADO" : row.strikesActive >= 2 ? "EN RIESGO" : "ACTIVO"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StrikeManager
                        courseId={courseId}
                        studentEmail={row.email}
                        bimestre={bimestre}
                        activeStrikes={row.activeStrikes}
                        blocked={row.blocked}
                      />
                      <Link
                        href={`/teacher/reports/student-strikes?email=${encodeURIComponent(row.email)}&courseId=${courseId}&bimestre=${bimestre}`}
                        target="_blank"
                        title="Ver informe de strikes"
                        className="flex items-center gap-1 rounded border border-[#1e3320] px-2 py-1 text-xs text-[#9aab8a] transition-colors hover:border-[#c9a227]/40 hover:text-[#c9a227]"
                      >
                        <FileText size={12} />
                        Informe
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
