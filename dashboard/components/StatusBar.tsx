"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AlertTriangle, Shield, ShieldAlert, X } from "lucide-react";
import type { Strike } from "@/lib/supabase/game";
import type { Talent } from "@/talentos/types";
import type { FormativeClassEntry } from "@/lib/supabase/classes";
import CharacterSheet from "@/dashboard/components/CharacterSheet";

gsap.registerPlugin(useGSAP);

// ─── Shared ────────────────────────────────────────────────────────────────

const MAX_STRIKES = 3;

const REASON_LABELS: Record<string, { label: string; color: string }> = {
  no_submission:    { label: "No entrega",               color: "text-[#c0392b]" },
  late_submission:  { label: "Entrega fuera de término", color: "text-[#c9a227]" },
  missing_material: { label: "Falta de material",        color: "text-[#c9a227]" },
};

const STRIKE_MESSAGES: Record<number, string> = {
  0: "Sin incumplimientos activos.",
  1: "1/3 — Mantené la rectitud técnica.",
  2: "2/3 — Un más bloqueará el bimestre.",
  3: "3/3 — Bimestre bloqueado.",
};

function formatXp(v: number) { return v.toLocaleString("es-AR"); }
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

function useCountUp(target: number, duration = 1300) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(easeOutCubic(p) * target));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return count;
}

// ─── Strikes Popup ─────────────────────────────────────────────────────────

function StrikesPopup({ strikeDetails, onClose }: { strikeDetails: Strike[]; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.timeline()
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" })
      .fromTo(cardRef.current, { opacity: 0, scale: 0.88, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" }, "-=0.1");
  }, { scope: overlayRef });

  function handleClose() {
    gsap.timeline({ onComplete: onClose })
      .to(cardRef.current, { opacity: 0, scale: 0.88, y: 16, duration: 0.2, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.15, ease: "power2.in" }, "-=0.1");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4" onClick={handleClose}>
      <div ref={cardRef} className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-[#c0392b]/50 rounded-tl-lg" />
        <div className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-[#c0392b]/50 rounded-tr-lg" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-[#c0392b]/50 rounded-bl-lg" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-[#c0392b]/50 rounded-br-lg" />
        <button onClick={handleClose} className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#1e3320] bg-[#0d1a0f] text-[#9aab8a] transition-colors hover:border-[#c0392b]/40 hover:text-[#f5f0e8]">
          <X size={14} />
        </button>
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#c0392b]/30 bg-[#0d1a0f] p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,57,43,0.05)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c0392b]/40 to-transparent" />
          <div className="relative flex flex-col items-center mb-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#c0392b]/30 bg-[#c0392b]/10">
              <ShieldAlert size={22} strokeWidth={1.4} className="text-[#c0392b]" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#9aab8a]/60">Registro de Incumplimientos</p>
            <div className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#c0392b]/30 to-transparent" />
          </div>
          <div className="relative flex flex-col gap-2">
            {strikeDetails.length === 0 ? (
              <p className="text-xs text-[#9aab8a]/60 text-center py-4">Sin incumplimientos registrados.</p>
            ) : strikeDetails.map((strike, i) => {
              const reason = REASON_LABELS[strike.reason] ?? { label: strike.reason, color: "text-[#9aab8a]" };
              return (
                <div key={strike.id} className="flex items-start gap-3 rounded-lg border border-[#1e3320] bg-[#0F2411] p-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[#c0392b]/40 bg-[#c0392b]/10 text-[10px] font-bold text-[#c0392b]">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold leading-tight ${reason.color}`}>{reason.label}</p>
                    <p className="mt-0.5 text-[10px] text-[#9aab8a]/60 uppercase tracking-wider">{strike.bimestre} · {formatDate(strike.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c0392b]/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

// ─── StatusBar ─────────────────────────────────────────────────────────────

interface StatusBarProps {
  xp: number;
  xpCurrentLevel: number;
  xpNextLevel: number;
  level: number;
  levelName: string;
  studentName: string;
  blocked: boolean;
  strikes: number;
  strikeDetails: Strike[];
  classEntry: FormativeClassEntry | null;
  talents: Talent[];
}

export default function StatusBar({
  xp, xpCurrentLevel, xpNextLevel, level, levelName, studentName,
  blocked, strikes, strikeDetails, classEntry, talents,
}: StatusBarProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const animatedXp = useCountUp(xp);
  const clamped = Math.min(strikes, MAX_STRIKES);
  const progress = Math.min(((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100, 100);
  const hasDetails = strikeDetails.length > 0;
  const strikeMessage = STRIKE_MESSAGES[clamped] ?? STRIKE_MESSAGES[3];

  // ── Level badge GSAP ──────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const shieldIconRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const badge = badgeRef.current;
      if (!badge) return;

      // Idle breathing glow
      gsap.to(badge, {
        boxShadow: "0 0 16px rgba(201,162,39,0.32), 0 0 4px rgba(201,162,39,0.12) inset",
        duration: 1.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const onEnter = contextSafe!(() => {
        gsap.killTweensOf(badge, "boxShadow");
        gsap.to(badge, {
          scale: 1.08,
          boxShadow: "0 0 28px rgba(201,162,39,0.6), 0 0 10px rgba(201,162,39,0.2) inset",
          duration: 0.28,
          ease: "power2.out",
        });
        gsap.to(shieldIconRef.current, {
          rotation: 14,
          scale: 1.15,
          duration: 0.35,
          ease: "back.out(2.5)",
        });
      });

      const onLeave = contextSafe!(() => {
        gsap.to(badge, {
          scale: 1,
          boxShadow: "0 0 4px rgba(201,162,39,0.08)",
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(badge, {
              boxShadow: "0 0 16px rgba(201,162,39,0.32), 0 0 4px rgba(201,162,39,0.12) inset",
              duration: 1.9,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        });
        gsap.to(shieldIconRef.current, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      const onClick = contextSafe!(() => {
        gsap.killTweensOf(badge, "scale");
        gsap.timeline()
          .to(badge, { scale: 0.92, duration: 0.1, ease: "power2.in" })
          .to(badge, { scale: 1.06, duration: 0.22, ease: "back.out(2)" })
          .to(badge, { scale: 1, duration: 0.15, ease: "power2.out" });
      });

      badge.addEventListener("mouseenter", onEnter);
      badge.addEventListener("mouseleave", onLeave);
      badge.addEventListener("click", onClick);

      return () => {
        badge.removeEventListener("mouseenter", onEnter);
        badge.removeEventListener("mouseleave", onLeave);
        badge.removeEventListener("click", onClick);
      };
    },
    { scope: containerRef }
  );

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`flex rounded-xl border overflow-hidden ${
          blocked ? "bg-[#0F2411] border-[#c0392b]/30" : "bg-[#0F2411] border-[#1e3320]"
        }`}
      >
        {/* ── XP section ── */}
        <div className="flex flex-1 gap-4 px-5 py-5">

          {/* Level badge — clickable trigger */}
          <button
            ref={badgeRef}
            onClick={() => setSheetOpen(true)}
            title="Ver Hoja de Personaje"
            className="flex-shrink-0 flex flex-col items-center justify-center w-[60px] rounded-xl border border-[#c9a227]/25 bg-[#c9a227]/5 cursor-pointer gap-0.5"
          >
            <div ref={shieldIconRef}>
              <Shield size={18} strokeWidth={1.3} className="text-[#c9a227]" />
            </div>
            <span className="font-serif text-xl font-bold text-[#c9a227] leading-none tabular-nums">
              {level}
            </span>
            <span className="text-[8px] font-medium uppercase tracking-widest text-[#9aab8a]/50">
              Nv.
            </span>
          </button>

          {/* XP details */}
          <div className="flex flex-1 flex-col justify-center">
            {/* Title row */}
            <div className="relative flex items-center justify-center mb-2">
              <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a] text-center">
                Resonancia de Experiencia
              </p>
              <div className="absolute right-0 flex items-baseline gap-1">
                <span className="font-serif text-2xl font-bold text-[#c9a227] tabular-nums">
                  {formatXp(animatedXp)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9aab8a]">XP</span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="mb-3 text-[10px] uppercase tracking-wider text-[#9aab8a]/70">
              {levelName} · {studentName}
              {blocked && <span className="ml-2 text-[#c0392b]">· Bimestre bloqueado</span>}
            </p>

            {/* Progress bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#0d1a0f]">
              <motion.div
                className={`h-full rounded-full ${blocked ? "bg-[#c0392b]/60" : "bg-gradient-to-r from-[#4a8f5a] via-[#8fbc8f] to-[#c9a227]"}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.3, delay: 0.25, ease: "easeOut" }}
              />
            </div>

            {/* Bottom stats */}
            <div className="mt-2.5 flex justify-between">
              <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]/70">
                Siguiente hito: {formatXp(xpNextLevel)} XP
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]">
                {Math.round(progress)}% Completado
              </p>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-px bg-[#1e3320] my-4" />

        {/* ── Strikes section ── */}
        <div
          onClick={() => hasDetails && setPopupOpen(true)}
          className={`flex w-56 flex-col justify-center px-5 py-5 transition-colors ${
            hasDetails ? "cursor-pointer hover:bg-[#c0392b]/5" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
              Strikes
            </p>
            {clamped >= 2 && (
              <motion.div animate={{ x: [0, -2, 2, -1, 0] }} transition={{ duration: 0.4, delay: 0.6 }}>
                <AlertTriangle size={13} className="text-[#c9a227]" />
              </motion.div>
            )}
          </div>

          <div className="flex gap-1.5 mb-3">
            {Array.from({ length: MAX_STRIKES }).map((_, i) => {
              const isActive = i < clamped;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isActive ? {
                    scale: 1, opacity: 1,
                    boxShadow: ["0 0 0px rgba(192,57,43,0)", "0 0 8px rgba(192,57,43,0.55)", "0 0 0px rgba(192,57,43,0)"],
                  } : { scale: 1, opacity: 1 }}
                  transition={isActive ? {
                    scale: { delay: i * 0.1, type: "spring", stiffness: 380, damping: 14 },
                    boxShadow: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                  } : {
                    scale: { delay: i * 0.1, duration: 0.3 },
                    opacity: { delay: i * 0.1, duration: 0.3 },
                  }}
                  className={`flex h-10 flex-1 items-center justify-center rounded-md border text-sm font-bold ${
                    isActive
                      ? "border-[#c0392b] bg-[#c0392b]/20 text-[#c0392b]"
                      : "border-[#1e3320] bg-[#0d1a0f]/60 text-[#1e3320]"
                  }`}
                >
                  ✕
                </motion.div>
              );
            })}
          </div>

          <p className="text-[10px] leading-relaxed text-[#9aab8a]">{strikeMessage}</p>

          {hasDetails && (
            <p className="mt-1.5 text-[9px] uppercase tracking-wider text-[#c0392b]/50">
              Toca para ver el detalle
            </p>
          )}
        </div>
      </motion.div>

      {popupOpen && (
        <StrikesPopup strikeDetails={strikeDetails} onClose={() => setPopupOpen(false)} />
      )}

      <CharacterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        studentName={studentName}
        level={level}
        levelName={levelName}
        classEntry={classEntry}
        talents={talents}
      />
    </>
  );
}
