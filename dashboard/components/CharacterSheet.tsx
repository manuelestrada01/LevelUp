"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import type { Talent } from "@/talentos/types";
import type { FormativeClassEntry } from "@/lib/supabase/classes";
import { getClassIcon } from "@/shared/classIcons";

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

const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")";


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
  const cx = 110, cy = 110, maxR = 72;
  const angles = ATTRIBUTES.map((_, i) => ((i * 60 - 90) * Math.PI) / 180);

  function getXY(angle: number, r: number) {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function toPath(pts: { x: number; y: number }[]) {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
  }

  const playerPoints = ATTRIBUTES.map((attr, i) => {
    const normalized = Math.min(scores[attr] / ATTR_MAX, 1);
    return getXY(angles[i], normalized * maxR);
  });

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[200px] mx-auto">
      {/* Grid rings */}
      {[0.33, 0.66, 1].map((lv, gi) => (
        <path
          key={gi}
          d={toPath(angles.map((a) => getXY(a, lv * maxR)))}
          fill="none"
          stroke="rgba(160,125,55,0.18)"
          strokeWidth={0.8}
        />
      ))}
      {/* Spokes */}
      {angles.map((angle, i) => {
        const outer = getXY(angle, maxR);
        return (
          <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y}
            stroke="rgba(160,125,55,0.15)" strokeWidth={0.8} />
        );
      })}
      {/* Player shape */}
      <path
        d={toPath(playerPoints)}
        fill="rgba(212,160,23,0.12)"
        stroke="rgba(212,160,23,0.75)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* Points */}
      {playerPoints.map((p, i) => (
        <rect key={i} x={p.x - 2.5} y={p.y - 2.5} width={5} height={5}
          fill="#d4a017" transform={`rotate(45, ${p.x}, ${p.y})`} />
      ))}
      {/* Labels */}
      {ATTRIBUTES.map((attr, i) => {
        const lp = getXY(angles[i], maxR + 19);
        return (
          <text key={attr} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="7" fill="rgba(160,125,55,0.6)" letterSpacing="0.1em"
            style={{ fontFamily: "Georgia, serif" }}>
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
  open, onClose, studentName, level, levelName, classEntry, talents,
}: CharacterSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scores = calcScores(classEntry, talents);
  const classTitle = classEntry?.title ?? "Sin clase";
  const classIcon  = getClassIcon(classTitle);

  useGSAP(
    () => {
      if (!open || !overlayRef.current) return;
      gsap.timeline()
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" })
        .fromTo(cardRef.current, { opacity: 0, scale: 0.91, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }, "-=0.1");
    },
    { dependencies: [open], scope: overlayRef }
  );

  function handleClose() {
    if (!overlayRef.current || !cardRef.current) { onClose(); return; }
    gsap.timeline({ onComplete: onClose })
      .to(cardRef.current, { opacity: 0, scale: 0.91, y: 14, duration: 0.2, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.15 }, "-=0.1");
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.82)" }}
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-2xl max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer bracket corners — wrought iron */}
        <div className="pointer-events-none absolute -top-2.5 -left-2.5 h-9 w-9 border-t-2 border-l-2 border-[rgba(160,125,55,0.55)]" />
        <div className="pointer-events-none absolute -top-2.5 -right-2.5 h-9 w-9 border-t-2 border-r-2 border-[rgba(160,125,55,0.55)]" />
        <div className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-9 w-9 border-b-2 border-l-2 border-[rgba(160,125,55,0.55)]" />
        <div className="pointer-events-none absolute -bottom-2.5 -right-2.5 h-9 w-9 border-b-2 border-r-2 border-[rgba(160,125,55,0.55)]" />

        {/* Close button — square */}
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center border border-[rgba(160,125,55,0.3)] bg-[#120e08] text-[rgba(200,168,75,0.5)] hover:text-[rgba(200,168,75,1)] transition-colors"
        >
          <X size={13} />
        </button>

        {/* Sheet panel — aged oak */}
        <div
          className="relative flex flex-col overflow-y-auto flex-1 min-h-0"
          style={{
            background: `${STONE_NOISE}, linear-gradient(170deg, #151418 0%, #0e0d12 100%)`,
            border: "1px solid rgba(160,125,55,0.45)",
            boxShadow: "0 12px 64px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Inner frame */}
          <div className="pointer-events-none absolute inset-[6px] border border-[rgba(160,125,55,0.1)]" style={{ zIndex: 0 }} />

          {/* Candlelight from above */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,168,75,0.04)_0%,transparent_50%)]" />

          {/* Corner ◆ marks */}
          <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none" style={{ zIndex: 1 }}>◆</span>
          <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none" style={{ zIndex: 1 }}>◆</span>
          <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none" style={{ zIndex: 1 }}>◆</span>
          <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none" style={{ zIndex: 1 }}>◆</span>

          {/* Top rule */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,168,75,0.45)] to-transparent" />

          {/* ── Header ── */}
          <div className="relative flex items-center gap-2 md:gap-5 px-3 py-2.5 md:px-7 md:py-5 border-b border-[rgba(160,125,55,0.18)]" style={{ zIndex: 2 }}>
            {/* Class icon in heraldic seal */}
            <div
              className="flex-shrink-0 flex items-center justify-center relative"
              style={{
                width: "52px", height: "52px",
                background: "rgba(160,125,55,0.07)",
                border: "1px solid rgba(160,125,55,0.35)",
              }}
            >
              <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.12)]" />
              <span className="pointer-events-none absolute top-[2px] left-[2px] text-[4px] text-[rgba(160,125,55,0.35)] leading-none select-none">◆</span>
              <span className="pointer-events-none absolute top-[2px] right-[2px] text-[4px] text-[rgba(160,125,55,0.35)] leading-none select-none">◆</span>
              <span className="pointer-events-none absolute bottom-[2px] left-[2px] text-[4px] text-[rgba(160,125,55,0.35)] leading-none select-none">◆</span>
              <span className="pointer-events-none absolute bottom-[2px] right-[2px] text-[4px] text-[rgba(160,125,55,0.35)] leading-none select-none">◆</span>
              <span className="text-3xl leading-none relative z-10 select-none" role="img" aria-label={classTitle}>
                {classIcon}
              </span>
            </div>

            {/* Identity block */}
            <div className="flex-1 min-w-0">
              {/* Title label */}
              <div className="flex items-center gap-2 mb-1">
                <div className="h-px w-4 bg-[rgba(160,125,55,0.35)]" />
                <span className="text-[10px] font-serif uppercase tracking-[0.35em] text-[rgba(200,168,75,0.5)]">
                  Hoja de Personaje
                </span>
              </div>
              <h2 className="font-serif text-xl md:text-3xl font-bold text-[rgba(232,224,208,0.92)] leading-tight">
                {studentName}
              </h2>
              <p className="mt-0.5 font-serif text-[13px] md:text-[15px] text-[rgba(200,168,75,0.6)] tracking-wider">
                Nivel {level} · {levelName}
              </p>
              {classEntry && (
                <p className="mt-0.5 font-serif text-[13px] text-[rgba(160,125,55,0.5)]">
                  {classTitle}
                  <span className="mx-1.5 opacity-40">·</span>
                  <span className="text-[rgba(160,125,55,0.35)]">Clase Formativa</span>
                </p>
              )}
            </div>
          </div>

          {/* ── Body: radar + attributes ── */}
          <div className="relative flex" style={{ zIndex: 2 }}>
            {/* Radar */}
            <div className="flex items-center justify-center p-2 md:p-6 flex-1 border-r border-[rgba(160,125,55,0.15)]">
              <HexRadar scores={scores} />
            </div>

            {/* Attribute bars */}
            <div className="flex flex-col justify-center gap-1.5 md:gap-3 p-2.5 md:p-6 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
                <p className="text-[10px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.5)]">
                  Atributos
                </p>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
              </div>
              {ATTRIBUTES.map((attr) => {
                const score = scores[attr];
                const pct = Math.min((score / ATTR_MAX) * 100, 100);
                const isClassAttr = classEntry?.attributes.includes(attr);
                return (
                  <div key={attr}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className={`text-[11px] md:text-[13px] font-serif ${isClassAttr ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.5)]"}`}>
                        {attr}
                      </span>
                      <span className="text-[11px] md:text-[13px] font-serif font-bold tabular-nums text-[rgba(232,224,208,0.7)]">
                        {score}
                      </span>
                    </div>
                    {/* Attribute bar — straight edges */}
                    <div className="h-1 md:h-1.5 w-full bg-[rgba(160,125,55,0.08)] border border-[rgba(160,125,55,0.15)] overflow-hidden">
                      <div
                        className={`h-full ${
                          isClassAttr
                            ? "bg-gradient-to-r from-[#a87a10] to-[#d4a017]"
                            : "bg-[rgba(160,125,55,0.3)]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Talents ── */}
          {talents.length > 0 && (
            <div
              className="relative px-3 py-2 md:px-7 md:py-4"
              style={{ borderTop: "1px solid rgba(160,125,55,0.18)", zIndex: 2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
                <p className="text-[10px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.5)]">
                  Talentos Activos
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
              </div>
              <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
                {talents.map((t) => (
                  <span
                    key={t.id}
                    className="border border-[rgba(160,125,55,0.28)] bg-[rgba(160,125,55,0.06)] px-2.5 py-0.5 text-[10px] md:text-[11px] font-serif uppercase tracking-[0.15em] text-[rgba(200,168,75,0.65)]"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom rule */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.3)] to-transparent" />
        </div>
      </div>
    </div>
  );
}
