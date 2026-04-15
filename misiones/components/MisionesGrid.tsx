"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mision } from "@/misiones/types";
import { Check, AlertCircle, Clock, Trophy, Zap, ChevronDown, ChevronUp } from "lucide-react";

gsap.registerPlugin(useGSAP);

const VISIBLE_COUNT = 4;

const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")";

function deadlineInfo(dueAt: Date | null): { text: string; urgent: boolean; overdue: boolean } {
  if (!dueAt) return { text: "Sin fecha límite", urgent: false, overdue: false };
  const diff = Math.ceil((dueAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: `Venció hace ${Math.abs(diff)} día${Math.abs(diff) === 1 ? "" : "s"}`, urgent: false, overdue: true };
  if (diff === 0) return { text: "Vence hoy", urgent: true, overdue: false };
  if (diff === 1) return { text: "Vence mañana", urgent: true, overdue: false };
  if (diff <= 4) return { text: `Vence en ${diff} días`, urgent: true, overdue: false };
  return { text: `Vence en ${diff} días`, urgent: false, overdue: false };
}

function MisionCard({ m, dataAttr }: { m: Mision; dataAttr?: string }) {
  const dl = deadlineInfo(m.dueAt);

  const leftAccent = dl.overdue
    ? "rgba(230,57,70,0.7)"
    : dl.urgent
    ? "rgba(212,140,23,0.6)"
    : "rgba(160,125,55,0.35)";

  return (
    <div
      data-mision={dataAttr}
      className="relative flex flex-col gap-3 p-5 hover:brightness-110 transition-all"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
        border: "1px solid rgba(160,125,55,0.32)",
        borderLeft: `2px solid ${leftAccent}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <div className="pointer-events-none absolute inset-[5px] border border-[rgba(160,125,55,0.07)]" />

      {/* Top row */}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-serif uppercase tracking-[0.2em] text-[rgba(160,125,55,0.6)] border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.06)] px-2 py-0.5">
            {m.tipo}
          </span>
          {(dl.urgent || dl.overdue) && (
            <span className={`flex items-center gap-1 text-[11px] font-serif uppercase tracking-wider px-1.5 py-0.5 ${
              dl.overdue
                ? "text-danger border border-danger/35 bg-danger/[0.07]"
                : "text-[rgba(212,140,23,0.85)] border border-[rgba(212,140,23,0.3)] bg-[rgba(212,140,23,0.07)]"
            }`}>
              <AlertCircle size={10} strokeWidth={2.5} />
              {dl.overdue ? "Atrasada" : "Urgente"}
            </span>
          )}
        </div>
        <span className="shrink-0 font-serif text-[17px] font-bold text-[#c8a84b]">
          +{m.xpReward.toLocaleString("es-AR")} XP
        </span>
      </div>

      <h4 className="relative font-serif text-[20px] text-[rgba(232,224,208,0.88)] leading-snug flex-1">{m.title}</h4>

      <p className={`relative flex items-center gap-1.5 text-[13px] font-serif uppercase tracking-wider ${
        dl.overdue ? "text-danger/60" : "text-[rgba(160,125,55,0.45)]"
      }`}>
        <Clock size={11} strokeWidth={1.5} />
        {dl.text}
      </p>
    </div>
  );
}

interface Props {
  pendientes: Mision[];
  completadas: Mision[];
  xpTotal: number;
  nivel: number;
  total: number;
}

export default function MisionesGrid({ pendientes, completadas, xpTotal, nivel, total }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const progressPct = total > 0 ? Math.round((completadas.length / total) * 100) : 0;
  const filledSegments = Math.round((progressPct / 100) * 10);
  const visible = pendientes.slice(0, VISIBLE_COUNT);
  const hidden = pendientes.slice(VISIBLE_COUNT);
  const hasMore = hidden.length > 0;

  const { contextSafe } = useGSAP(
    () => {
      gsap.fromTo("[data-stat]", { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.35, ease: "power3.out", delay: 0.1 });
      gsap.fromTo("[data-mision='visible']", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.45, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-card-completada]", { opacity: 0, x: -8 }, { opacity: 1, x: 0, stagger: 0.04, duration: 0.3, ease: "power2.out", delay: 0.45 });
    },
    { scope: containerRef }
  );

  const handleToggle = contextSafe(() => {
    if (!expanded) {
      setExpanded(true);
      gsap.fromTo("[data-mision='hidden']", { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.38, ease: "power3.out", delay: 0.02 });
    } else {
      gsap.to("[data-mision='hidden']", {
        opacity: 0, y: 10, stagger: 0.05, duration: 0.22, ease: "power2.in",
        onComplete: () => setExpanded(false),
      });
    }
  });

  return (
    <div ref={containerRef} className="flex flex-col gap-8">

      {/* ── Stats strip ── */}
      <div
        className="relative px-4 py-4 md:px-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 overflow-hidden"
        style={{
          background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
          border: "1px solid rgba(160,125,55,0.32)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        <div className="pointer-events-none absolute inset-[5px] border border-[rgba(160,125,55,0.07)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(200,148,40,0.06)_0%,transparent_55%)]" />

        {/* Progress bar */}
        <div className="w-full md:flex-1 relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.5)]">Progreso del bimestre</p>
            <p className="text-[11px] font-serif uppercase tracking-wider text-[rgba(200,168,75,0.6)]">{progressPct}%</p>
          </div>
          <div className="flex gap-0.5 h-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${i < filledSegments ? "xp-bar-fill" : "bg-[rgba(160,125,55,0.1)]"}`}
                style={{ clipPath: "polygon(0 0, calc(100% - 2px) 0, 100% 100%, 2px 100%)" }}
              />
            ))}
          </div>
        </div>

        <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-[rgba(160,125,55,0.25)] to-transparent" />

        <div className="w-full md:w-auto grid grid-cols-3 md:flex md:items-center md:gap-6 gap-3">
        {[
          { label: "Completadas", value: `${completadas.length}/${total}`, color: "text-[rgba(232,224,208,0.8)]" },
          { label: "XP Total", value: `${xpTotal.toLocaleString("es-AR")} XP`, color: "text-[#c8a84b] gold-glow-sm" },
          { label: "Nivel", value: String(nivel), color: "text-[rgba(200,168,75,0.7)]" },
        ].map(({ label, value, color }) => (
          <div key={label} data-stat className="text-center relative" style={{ opacity: 0 }}>
            <p className="text-[10px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.45)] mb-0.5">{label}</p>
            <p className={`font-serif text-[18px] md:text-[22px] font-bold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
        </div>
      </div>

      {/* ── Misiones Activas ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Trophy size={15} className="text-[#c8a84b]" />
          <h3 className="font-serif text-[25px] text-[rgba(232,224,208,0.88)]">Misiones Activas</h3>
          {pendientes.length > 0 && (
            <span className="ml-auto text-[11px] font-serif uppercase tracking-[0.2em] text-[rgba(200,168,75,0.7)] border border-[rgba(160,125,55,0.3)] bg-[rgba(160,125,55,0.07)] px-2.5 py-0.5">
              {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {pendientes.length === 0 ? (
          <div
            className="relative flex items-center gap-3 p-6 font-serif text-[17px] italic text-[rgba(160,125,55,0.5)]"
            style={{
              background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
              border: "1px solid rgba(160,125,55,0.25)",
            }}
          >
            <Check size={15} className="text-[#c8a84b] shrink-0" />
            Todo al día — no hay misiones pendientes en este bimestre.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visible.map((m) => <MisionCard key={m.id} m={m} dataAttr="visible" />)}
              {expanded && hidden.map((m) => <MisionCard key={m.id} m={m} dataAttr="hidden" />)}
            </div>

            {hasMore && (
              <button
                onClick={handleToggle}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-[11px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.8)] transition-colors"
                style={{ border: "1px solid rgba(160,125,55,0.2)", background: "rgba(160,125,55,0.04)" }}
              >
                {expanded ? (
                  <><ChevronUp size={13} strokeWidth={2} /> Ver menos</>
                ) : (
                  <><ChevronDown size={13} strokeWidth={2} /> Ver {hidden.length} misión{hidden.length !== 1 ? "es" : ""} más</>
                )}
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Completadas ── */}
      {completadas.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <Check size={14} className="text-[#c8a84b]" />
            <h3 className="font-serif text-[22px] text-[rgba(200,168,75,0.55)]">Completadas este bimestre</h3>
            <span className="ml-auto text-[11px] font-serif text-[rgba(160,125,55,0.4)] tabular-nums">
              {completadas.length} misión{completadas.length !== 1 ? "es" : ""}
            </span>
          </div>
          <div
            className="relative overflow-hidden"
            style={{
              background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
              border: "1px solid rgba(160,125,55,0.28)",
            }}
          >
            {completadas.map((m, i) => {
              const fechaEntrega = m.submittedAt
                ? m.submittedAt.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
                : m.dueAt
                ? m.dueAt.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
                : null;
              return (
                <div
                  key={m.id}
                  data-card-completada
                  className={`flex items-center gap-3 px-5 py-3.5 group ${
                    i !== completadas.length - 1 ? "border-b border-[rgba(160,125,55,0.12)]" : ""
                  }`}
                >
                  <span className="text-[#c8a84b]/40 text-[11px] font-serif">✓</span>
                  <span className="text-[11px] font-serif uppercase tracking-wider text-[rgba(160,125,55,0.35)] shrink-0 w-9">{m.tipo}</span>
                  <span className="font-serif text-[17px] text-[rgba(232,224,208,0.5)] truncate min-w-0">{m.title}</span>
                  <span className="flex-1 border-b border-dotted border-[rgba(160,125,55,0.12)] group-hover:border-[rgba(160,125,55,0.25)] transition-colors mx-2 mb-0.5 min-w-4" />
                  <span className="text-[13px] font-serif text-[rgba(160,125,55,0.35)] tabular-nums shrink-0">{fechaEntrega ?? "—"}</span>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {(m.xpBonus ?? 0) > 0 && (
                      <span className="flex items-center gap-0.5 text-[11px] text-[rgba(160,125,55,0.6)] border border-[rgba(160,125,55,0.2)] bg-[rgba(160,125,55,0.06)] px-1 py-0.5">
                        <Zap size={9} />
                        +{m.xpBonus}
                      </span>
                    )}
                    <span className="font-serif text-[17px] font-bold text-[#c8a84b] tabular-nums">
                      +{m.xpReward.toLocaleString("es-AR")} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {pendientes.length === 0 && completadas.length === 0 && (
        <p className="font-serif text-[17px] italic text-[rgba(160,125,55,0.4)] text-center py-16">
          Sin misiones registradas para este bimestre.
        </p>
      )}
    </div>
  );
}
