"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ActivityEntry } from "@/xp/types";
import { Mail, Zap, Star, Trophy, Lock, Unlock } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface ActivityFeedProps {
  entries: ActivityEntry[];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffH < 1) return "Hace unos minutos";
  if (diffH < 24) return `Hace ${diffH}h`;
  return `Hace ${diffD}d`;
}

function toRoman(n: number): string {
  return ["I", "II", "III", "IV", "V"][n - 1] ?? String(n);
}

const EVENT_ICONS: Record<ActivityEntry["type"], React.ElementType> = {
  xp_base: Mail,
  xp_silent: Zap,
  xp_quality: Star,
  xp_event: Trophy,
  strike_added: Lock,
  strike_removed: Unlock,
  level_up: Trophy,
  badge_earned: Star,
  bimester_blocked: Lock,
  bimester_unlocked: Unlock,
};

// Bronze/amber tones — all event types use the medieval palette
const EVENT_ICON_BG: Record<ActivityEntry["type"], string> = {
  xp_base:           "text-[#c8a84b] bg-[rgba(200,168,75,0.08)] border border-[rgba(160,125,55,0.25)]",
  xp_silent:         "text-[#d4b86a] bg-[rgba(200,168,75,0.1)] border border-[rgba(160,125,55,0.3)]",
  xp_quality:        "text-[#e8c96a] bg-[rgba(200,168,75,0.12)] border border-[rgba(160,125,55,0.35)]",
  xp_event:          "text-[#c8a84b] bg-[rgba(200,168,75,0.08)] border border-[rgba(160,125,55,0.25)]",
  strike_added:      "text-danger bg-danger/[0.08] border border-danger/25",
  strike_removed:    "text-[#8fb89f] bg-[rgba(143,184,159,0.08)] border border-[rgba(143,184,159,0.2)]",
  level_up:          "text-[#e8c96a] bg-[rgba(200,168,75,0.14)] border border-[rgba(160,125,55,0.38)]",
  badge_earned:      "text-[#c8a84b] bg-[rgba(200,168,75,0.1)] border border-[rgba(160,125,55,0.28)]",
  bimester_blocked:  "text-danger bg-danger/10 border border-danger/30",
  bimester_unlocked: "text-[#8fb89f] bg-[rgba(143,184,159,0.1)] border border-[rgba(143,184,159,0.25)]",
};

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.timeline()
      .fromTo(
        containerRef.current?.querySelectorAll("[data-entry]") ?? [],
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, stagger: 0.07, duration: 0.38, ease: "power3.out" },
        "-=0.3"
      );
  }, { scope: containerRef });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      className="chronicle-stone h-full p-5 flex flex-col relative"
    >
      {/* Corner diamond ornaments — at inner frame corners */}
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[6px] text-gold/22 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[6px] text-gold/22 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[6px] text-gold/22 leading-none select-none" style={{ zIndex: 1 }}>◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[6px] text-gold/22 leading-none select-none" style={{ zIndex: 1 }}>◆</span>

      {/* Candlelight from above */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.05)_0%,transparent_55%)]" />

      {/* Header — carved stone tablet inscription */}
      <div className="relative flex flex-col items-center mb-5 gap-1.5" style={{ zIndex: 2 }}>
        <div className="flex items-center w-full gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.4)] to-transparent" />
          <span className="text-gold/40 text-[8px] font-serif leading-none tracking-widest">✦ ✦ ✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.4)] to-transparent" />
        </div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[rgba(200,168,75,0.7)] font-serif">
          Crónica del Escriba
        </p>
        <div className="flex items-center w-full gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
          <span className="text-[rgba(160,125,55,0.3)] text-[6px] font-serif leading-none">◆</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-8 gap-2" style={{ zIndex: 2 }}>
          <span className="text-gold/15 text-2xl font-serif leading-none">⚔</span>
          <p className="text-xs text-sage/40 font-serif italic">
            El escriba aún no ha registrado eventos.
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-0" style={{ zIndex: 2 }}>
          {entries.slice(0, 5).map((entry, index) => {
            const Icon = EVENT_ICONS[entry.type];
            const iconBgClass = EVENT_ICON_BG[entry.type];
            const hasXp = entry.xpDelta !== undefined && entry.xpDelta !== 0;

            return (
              <div
                key={entry.id}
                data-entry
                className="relative flex items-start gap-3 pl-1 pr-3 py-3 border-b border-[rgba(160,125,55,0.12)] last:border-b-0"
                style={{ opacity: 0 }}
              >
                {/* Timeline node — square badge, no chamfer */}
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  <div className={`flex h-9 w-9 items-center justify-center ${iconBgClass}`}>
                    <Icon size={14} strokeWidth={1.4} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-baseline gap-2">
                    {/* Roman numeral as chapter marker */}
                    <span className="font-serif text-[14px] font-bold text-[rgba(160,125,55,0.45)] flex-shrink-0 leading-none w-5 text-right">
                      {toRoman(index + 1)}
                    </span>
                    <p className="text-[14px] font-serif text-cream/85 leading-tight truncate">
                      {entry.description}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] font-serif uppercase tracking-[0.15em] text-[rgba(160,125,55,0.4)]">
                    {formatRelativeTime(entry.timestamp)}
                    {entry.productionType && (
                      <span className="ml-1.5 text-[rgba(160,125,55,0.3)]">· {entry.productionType}</span>
                    )}
                  </p>
                </div>

                {/* XP delta — amber gold */}
                {hasXp && (
                  <span className={`flex-shrink-0 text-[13px] font-serif font-semibold tabular-nums mt-0.5 ${
                    entry.xpDelta! > 0 ? "text-[#c8a84b]" : "text-danger"
                  }`}>
                    {entry.xpDelta! > 0 ? "+" : ""}{entry.xpDelta}
                    <span className="text-[10px] ml-0.5 opacity-60">xp</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
