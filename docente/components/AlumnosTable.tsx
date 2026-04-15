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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(160,125,55,0.5)]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar alumno por nombre o mail…"
            className="w-full border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] py-2 pl-8 pr-3 text-sm font-serif text-[rgba(232,224,208,0.85)] placeholder-[rgba(160,125,55,0.4)] outline-none focus:border-[rgba(200,168,75,0.55)]"
          />
        </div>
        <button
          onClick={() => setOnlyWithStrikes((v) => !v)}
          className={`flex items-center gap-1.5 border px-3 py-2 text-[11px] font-serif uppercase tracking-[0.12em] transition-colors ${
            onlyWithStrikes
              ? "border-[rgba(192,57,43,0.5)] bg-[rgba(192,57,43,0.12)] text-[#c0392b]"
              : "border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] text-[rgba(160,125,55,0.6)] hover:border-[rgba(192,57,43,0.4)] hover:text-[#c0392b]"
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
        <div className="border border-dashed border-[rgba(160,125,55,0.2)] p-12 text-center">
          <p className="font-serif text-[rgba(160,125,55,0.5)]">
            {onlyWithStrikes && !query
              ? "Ningún alumno tiene strikes en este bimestre."
              : query
              ? "Sin resultados para esa búsqueda."
              : "No hay datos para el bimestre seleccionado."}
          </p>
        </div>
      ) : (
        <div className="chronicle-stone relative overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] font-serif uppercase tracking-[0.15em]" style={{ background: "rgba(160,125,55,0.07)", borderBottom: "1px solid rgba(160,125,55,0.18)" }}>
              <tr>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Alumno</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Mail</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Nv.</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Título</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Rol</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">XP</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Clase</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Strikes</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Estado</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(160,125,55,0.1)]">
              {filtered.map((row) => (
                <tr key={row.email} className="hover:bg-[rgba(160,125,55,0.04)] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/teacher/students/${encodeURIComponent(row.email)}`}
                      className="font-serif font-medium text-[rgba(232,224,208,0.9)] hover:text-[#c9a227] transition-colors"
                    >
                      {row.displayName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs font-serif text-[rgba(160,125,55,0.55)]">{row.email}</td>
                  <td className="px-4 py-3 font-serif text-[rgba(232,224,208,0.85)]">{row.level}</td>
                  <td className="px-4 py-3 text-xs font-serif text-[rgba(232,224,208,0.75)]">{row.levelTitle ?? "—"}</td>
                  <td className="px-4 py-3 text-xs font-serif text-[rgba(160,125,55,0.55)]">{row.levelRole ?? "—"}</td>
                  <td className="px-4 py-3 font-serif font-medium text-[#c9a227]">{row.xpTotal}</td>
                  <td className="px-4 py-3 text-xs font-serif text-[rgba(160,125,55,0.55)]">{row.formativeTitle}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span
                          key={i}
                          className={`flex h-5 w-5 items-center justify-center text-xs font-bold ${
                            i < row.strikesActive
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
                        row.blocked
                          ? "border-[rgba(192,57,43,0.4)] bg-[rgba(192,57,43,0.12)] text-[#c0392b]"
                          : row.strikesActive >= 2
                          ? "border-[rgba(180,150,40,0.4)] bg-[rgba(180,150,40,0.1)] text-yellow-400"
                          : "border-[rgba(143,188,143,0.3)] bg-[rgba(143,188,143,0.08)] text-[#8fbc8f]"
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
                        className="flex items-center gap-1 border border-[rgba(160,125,55,0.25)] px-2 py-1 text-[11px] font-serif text-[rgba(160,125,55,0.55)] transition-colors hover:border-[rgba(200,168,75,0.45)] hover:text-[rgba(200,168,75,0.85)]"
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
