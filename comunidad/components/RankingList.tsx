"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Axe, Music, HeartHandshake, Shield, Leaf, BookOpen, type LucideIcon,
} from "lucide-react";
import type { RankingEntry } from "@/lib/supabase/comunidad";

gsap.registerPlugin(useGSAP);

const CLASS_ICONS: Record<string, LucideIcon> = {
  barbaro: Axe,
  bardo: Music,
  clerigo: HeartHandshake,
  paladin: Shield,
  druida: Leaf,
  erudito: BookOpen,
};

const CLASS_LABELS: Record<string, string> = {
  barbaro: "Bárbaro",
  bardo: "Bardo",
  clerigo: "Clérigo",
  paladin: "Paladín",
  druida: "Druida",
  erudito: "Erudito",
};

const MEDAL: Record<number, { label: string; bg: string; border: string; text: string; numColor: string }> = {
  1: { label: "1°", bg: "bg-[#c9a227]/10", border: "border-[#c9a227]/40", text: "text-[#c9a227]", numColor: "text-[#c9a227]" },
  2: { label: "2°", bg: "bg-[#b0b8c1]/10", border: "border-[#b0b8c1]/30", text: "text-[#b0b8c1]", numColor: "text-[#b0b8c1]" },
  3: { label: "3°", bg: "bg-[#cd7f32]/10", border: "border-[#cd7f32]/30", text: "text-[#cd7f32]", numColor: "text-[#cd7f32]" },
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

interface Props {
  entries: RankingEntry[];
  currentEmail: string;
}

export default function RankingList({ entries, currentEmail }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxXp = entries[0]?.xpTotal ?? 1;
  const currentEntry = entries.find((e) => e.email === currentEmail);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-row]",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, stagger: 0.055, duration: 0.4, ease: "power3.out", delay: 0.1 }
      );
    },
    { scope: containerRef }
  );

  if (!entries.length) {
    return (
      <p className="text-sm text-[#9aab8a]/60 text-center py-16">
        Sin datos de ranking disponibles.
      </p>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {/* Tu posición — banner */}
      {currentEntry && (
        <div className="rounded-xl border border-[#c9a227]/20 bg-[#c9a227]/5 px-5 py-3 flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-widest text-[#9aab8a]/60">Tu posición</p>
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-bold text-[#c9a227]">#{currentEntry.position}</span>
            <span className="text-[10px] text-[#9aab8a]">de {entries.length} estudiantes</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_140px_80px_120px] gap-4 px-5 py-2">
        {["#", "Estudiante", "Clase", "Nivel", "XP"].map((h) => (
          <p key={h} className="text-[9px] uppercase tracking-widest text-[#9aab8a]/40 font-semibold">
            {h}
          </p>
        ))}
      </div>

      {/* Rows */}
      {entries.map((entry) => {
        const isMe = entry.email === currentEmail;
        const medal = MEDAL[entry.position];
        const Icon = CLASS_ICONS[entry.formativeClass] ?? BookOpen;
        const classLabel = CLASS_LABELS[entry.formativeClass] ?? entry.formativeClass;
        const barWidth = Math.round((entry.xpTotal / maxXp) * 100);

        return (
          <div
            key={entry.email}
            data-row
            className={`grid grid-cols-[40px_1fr_140px_80px_120px] gap-4 items-center rounded-xl border px-5 py-3.5 transition-colors ${
              isMe
                ? "border-[#c9a227]/30 bg-[#c9a227]/8 shadow-[0_0_20px_rgba(201,162,39,0.06)]"
                : medal
                ? `${medal.bg} ${medal.border}`
                : "border-[#1e3320] bg-[#0F2411]"
            }`}
          >
            {/* Position */}
            <div className="flex items-center justify-center">
              {medal ? (
                <span className={`font-serif text-lg font-bold ${medal.numColor}`}>
                  {medal.label}
                </span>
              ) : (
                <span className="text-sm font-semibold text-[#9aab8a]/50 tabular-nums">
                  {entry.position}
                </span>
              )}
            </div>

            {/* Student */}
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                isMe ? "bg-[#c9a227]/20 text-[#c9a227]" : "bg-[#1e3320] text-[#9aab8a]"
              }`}>
                {initials(entry.displayName)}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold leading-tight truncate ${isMe ? "text-[#c9a227]" : "text-[#f5f0e8]"}`}>
                  {entry.displayName}
                  {isMe && <span className="ml-2 text-[9px] uppercase tracking-wider text-[#c9a227]/60">· tú</span>}
                </p>
              </div>
            </div>

            {/* Class */}
            <div className="flex items-center gap-2">
              <Icon size={13} strokeWidth={1.5} className={medal ? medal.text : "text-[#9aab8a]/60"} />
              <span className={`text-xs ${medal ? medal.text : "text-[#9aab8a]"}`}>{classLabel}</span>
            </div>

            {/* Level */}
            <span className={`text-sm font-bold tabular-nums ${medal ? medal.text : isMe ? "text-[#c9a227]" : "text-[#9aab8a]"}`}>
              Nv. {entry.level}
            </span>

            {/* XP + bar */}
            <div className="flex flex-col gap-1">
              <span className={`text-xs font-bold tabular-nums text-right ${medal ? medal.text : isMe ? "text-[#c9a227]" : "text-[#8fbc8f]"}`}>
                {entry.xpTotal.toLocaleString("es-AR")} XP
              </span>
              <div className="h-1 w-full rounded-full bg-[#0d1a0f] overflow-hidden">
                <div
                  className={`h-full rounded-full ${isMe || entry.position === 1 ? "bg-gradient-to-r from-[#4a8f5a] to-[#c9a227]" : "bg-[#1e3320]"}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
