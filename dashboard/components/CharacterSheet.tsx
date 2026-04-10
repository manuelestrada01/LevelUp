"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import type { Talent } from "@/talentos/types";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

gsap.registerPlugin(useGSAP);

const ATTRIBUTES = [
  "Fuerza",
  "Constitución",
  "Destreza",
  "Carisma",
  "Sabiduría",
  "Inteligencia",
] as const;
type Attribute = (typeof ATTRIBUTES)[number];

const ATTR_SHORT: Record<Attribute, string> = {
  Fuerza: "FUE",
  Constitución: "CON",
  Destreza: "DES",
  Carisma: "CAR",
  Sabiduría: "SAB",
  Inteligencia: "INT",
};

const ATTR_MAX = 10;

function calcScores(
  classEntry: FormativeClassEntry | null,
  talents: Talent[]
): Record<Attribute, number> {
  const scores: Record<Attribute, number> = {
    Fuerza: 3,
    Constitución: 3,
    Destreza: 3,
    Carisma: 3,
    Sabiduría: 3,
    Inteligencia: 3,
  };

  if (classEntry?.attributes) {
    for (const attr of classEntry.attributes) {
      const key = attr as Attribute;
      if (key in scores) scores[key] += 4;
    }
  }

  for (const talent of (talents ?? [])) {
    for (const attr of talent.attributes) {
      const key = attr as Attribute;
      if (key in scores) scores[key] += 1;
    }
  }

  return scores;
}

function HexRadar({ scores }: { scores: Record<Attribute, number> }) {
  const cx = 110,
    cy = 110,
    maxR = 72;
  const angles = ATTRIBUTES.map((_, i) => ((i * 60 - 90) * Math.PI) / 180);

  function getXY(angle: number, r: number) {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function toPath(pts: { x: number; y: number }[]) {
    return (
      pts
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(" ") + " Z"
    );
  }

  const playerPoints = ATTRIBUTES.map((attr, i) => {
    const normalized = Math.min(scores[attr] / ATTR_MAX, 1);
    return getXY(angles[i], normalized * maxR);
  });

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[220px] mx-auto">
      {[0.33, 0.66, 1].map((level, gi) => (
        <path
          key={gi}
          d={toPath(angles.map((a) => getXY(a, level * maxR)))}
          fill="none"
          stroke="#1e3320"
          strokeWidth={0.8}
        />
      ))}

      {angles.map((angle, i) => {
        const outer = getXY(angle, maxR);
        return (
          <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#1e3320" strokeWidth={0.8} />
        );
      })}

      <path
        d={toPath(playerPoints)}
        fill="rgba(201,162,39,0.15)"
        stroke="#c9a227"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {playerPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#c9a227" />
      ))}

      {ATTRIBUTES.map((attr, i) => {
        const lp = getXY(angles[i], maxR + 19);
        return (
          <text
            key={attr}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7.5"
            fill="#9aab8a"
            fontFamily="sans-serif"
            letterSpacing="0.08em"
          >
            {ATTR_SHORT[attr]}
          </text>
        );
      })}
    </svg>
  );
}

interface CharacterSheetProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  level: number;
  levelName: string;
  classEntry: FormativeClassEntry | null;
  talents: Talent[];
}

export default function CharacterSheet({
  open,
  onClose,
  studentName,
  level,
  levelName,
  classEntry,
  talents,
}: CharacterSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scores = calcScores(classEntry, talents);

  useGSAP(
    () => {
      if (!open || !overlayRef.current) return;
      gsap
        .timeline()
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" })
        .fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.9, y: 28 },
          { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: "power3.out" },
          "-=0.1"
        );
    },
    { dependencies: [open], scope: overlayRef }
  );

  function handleClose() {
    if (!overlayRef.current || !cardRef.current) {
      onClose();
      return;
    }
    gsap
      .timeline({ onComplete: onClose })
      .to(cardRef.current, { opacity: 0, scale: 0.9, y: 16, duration: 0.2, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.15 }, "-=0.1");
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-[#c9a227]/40 rounded-tl-lg" />
        <div className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-[#c9a227]/40 rounded-tr-lg" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-[#c9a227]/40 rounded-bl-lg" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-[#c9a227]/40 rounded-br-lg" />

        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#1e3320] bg-[#0d1a0f] text-[#9aab8a] transition-colors hover:text-[#f5f0e8]"
        >
          <X size={14} />
        </button>

        <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#c9a227]/20 bg-[#0d1a0f] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.06)_0%,transparent_60%)]" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />

          <div className="relative flex flex-col items-center pt-6 pb-4 px-6 border-b border-[#1e3320]">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#9aab8a]/50 mb-1">
              Hoja de Personaje
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#f5f0e8]">{studentName}</h2>
            <p className="mt-1 text-xs text-[#c9a227]/80 tracking-wider">
              Nivel {level} · {levelName}
            </p>
            {classEntry && (
              <p className="mt-1 text-[11px] text-[#9aab8a]/60">
                Clase Formativa:{" "}
                <span className="text-[#8fbc8f]">{classEntry.title}</span>
              </p>
            )}
          </div>

          <div className="relative flex divide-x divide-[#1e3320]">
            <div className="flex items-center justify-center p-6 flex-1">
              <HexRadar scores={scores} />
            </div>

            <div className="flex flex-col justify-center gap-3 p-6 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-widest text-[#9aab8a]/50 mb-1">
                Atributos
              </p>
              {ATTRIBUTES.map((attr) => {
                const score = scores[attr];
                const pct = Math.min((score / ATTR_MAX) * 100, 100);
                const isClassAttr = classEntry?.attributes.includes(attr);
                return (
                  <div key={attr}>
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-[11px] font-medium ${
                          isClassAttr ? "text-[#c9a227]" : "text-[#9aab8a]"
                        }`}
                      >
                        {attr}
                      </span>
                      <span className="text-[11px] font-bold tabular-nums text-[#f5f0e8]">
                        {score}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#0d1a0f] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isClassAttr
                            ? "bg-gradient-to-r from-[#c9a227] to-[#e8c547]"
                            : "bg-[#4a8f5a]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {talents.length > 0 && (
            <div className="relative border-t border-[#1e3320] px-6 py-4">
              <p className="text-[10px] font-medium uppercase tracking-widest text-[#9aab8a]/50 mb-3">
                Talentos Activos
              </p>
              <div className="flex flex-wrap gap-2">
                {talents.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-md border border-[#c9a227]/20 bg-[#c9a227]/5 px-2.5 py-1 text-[10px] text-[#c9a227]/80"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
