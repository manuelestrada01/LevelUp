"use client";

import Link from "next/link";
import { StudentGameState, Strike } from "@/lib/supabase/game";
import StrikeManager from "./StrikeManager";

interface Props {
  state: StudentGameState;
  courseId: string;
  strikes: Strike[];
}

export default function StudentRow({ state, courseId, strikes }: Props) {
  const activeStrikes = strikes.filter((s) => s.active);

  return (
    <tr className="hover:bg-[#1a2e1c]">
      <td className="px-4 py-3">
        <Link
          href={`/teacher/students/${encodeURIComponent(state.student_email)}`}
          className="text-[#f5f0e8] hover:text-[#c9a227] hover:underline"
        >
          {state.student_email}
        </Link>
      </td>
      <td className="px-4 py-3 text-[#8fbc8f]">Nv. {state.level}</td>
      <td className="px-4 py-3 font-medium text-[#c9a227]">{state.xp_total}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`flex h-5 w-5 items-center justify-center rounded text-xs font-bold ${
                i < state.strikes_active
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
        <StatusBadge blocked={state.blocked} strikesActive={state.strikes_active} />
      </td>
      <td className="px-4 py-3">
        <StrikeManager
          studentEmail={state.student_email}
          courseId={courseId}
          bimestre={state.bimestre}
          activeStrikes={activeStrikes}
          blocked={state.blocked}
        />
      </td>
    </tr>
  );
}

function StatusBadge({ blocked, strikesActive }: { blocked: boolean; strikesActive: number }) {
  if (blocked) {
    return (
      <span className="rounded px-2 py-0.5 text-xs font-medium bg-[#c0392b]/20 text-[#c0392b]">
        BLOQUEADO
      </span>
    );
  }
  if (strikesActive >= 2) {
    return (
      <span className="rounded px-2 py-0.5 text-xs font-medium bg-yellow-900/30 text-yellow-400">
        EN RIESGO
      </span>
    );
  }
  return (
    <span className="rounded px-2 py-0.5 text-xs font-medium bg-[#1e3320] text-[#8fbc8f]">
      ACTIVO
    </span>
  );
}
