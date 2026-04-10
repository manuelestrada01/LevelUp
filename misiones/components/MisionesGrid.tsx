"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mision } from "@/misiones/types";
import { Check, AlertCircle, Clock, Trophy, Zap, ChevronDown, ChevronUp } from "lucide-react";

gsap.registerPlugin(useGSAP);

const VISIBLE_COUNT = 3;

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
  const borderAccent = dl.overdue ? "border-l-[#c0392b]" : dl.urgent ? "border-l-[#c9a227]" : "border-l-[#8fbc8f]/40";
  const urgencyColor = dl.overdue
    ? "text-[#c0392b] bg-[#c0392b]/10 border-[#c0392b]/20"
    : "text-[#c9a227] bg-[#c9a227]/10 border-[#c9a227]/20";

  return (
    <div
      data-mision={dataAttr}
      className={`rounded-xl border border-[#1e3320] border-l-2 ${borderAccent} bg-[#0F2411] p-5 flex flex-col gap-3 hover:brightness-110 transition-all`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#9aab8a] bg-[#1e3320] px-2 py-0.5 rounded">
          {m.tipo}
        </span>
        {(dl.urgent || dl.overdue) && (
          <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold border rounded px-1.5 py-0.5 ${urgencyColor}`}>
            <AlertCircle size={9} strokeWidth={2.5} />
            {dl.overdue ? "Atrasada" : "Urgente"}
          </span>
        )}
        <span className="ml-auto font-serif text-base font-bold text-[#8fbc8f]">
          +{m.xpReward.toLocaleString("es-AR")} XP
        </span>
      </div>
      <h4 className="font-serif text-lg text-[#f5f0e8] leading-snug flex-1">{m.title}</h4>
      <p className={`flex items-center gap-1.5 text-[11px] ${dl.overdue ? "text-[#c0392b]/80" : "text-[#9aab8a]/70"}`}>
        <Clock size={10} strokeWidth={1.5} />
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
  const extraRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const progressPct = total > 0 ? Math.round((completadas.length / total) * 100) : 0;
  const visible = pendientes.slice(0, VISIBLE_COUNT);
  const hidden = pendientes.slice(VISIBLE_COUNT);
  const hasMore = hidden.length > 0;

  const { contextSafe } = useGSAP(
    () => {
      gsap.fromTo("[data-stat]", { opacity: 0, y: -8 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.35, ease: "power2.out", delay: 0.1 });
      gsap.fromTo("[data-mision='visible']", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.45, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-card-completada]", { opacity: 0 }, { opacity: 1, stagger: 0.04, duration: 0.3, ease: "power2.out", delay: 0.45 });
    },
    { scope: containerRef }
  );

  const handleToggle = contextSafe(() => {
    if (!expanded) {
      setExpanded(true);
      // animate in after state update — use a tiny delay for DOM to render
      gsap.fromTo(
        "[data-mision='hidden']",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.38, ease: "power3.out", delay: 0.02 }
      );
    } else {
      gsap.to("[data-mision='hidden']", {
        opacity: 0,
        y: 10,
        stagger: 0.05,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => setExpanded(false),
      });
    }
  });

  return (
    <div ref={containerRef} className="flex flex-col gap-8">

      {/* ── Stats strip ── */}
      <div className="rounded-xl border border-[#1e3320] bg-[#0F2411] px-6 py-4 flex items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] uppercase tracking-widest text-[#9aab8a]/60">Progreso del bimestre</p>
            <p className="text-[9px] uppercase tracking-widest text-[#9aab8a]">{progressPct}%</p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#0d1a0f] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4a8f5a] via-[#8fbc8f] to-[#c9a227] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="h-8 w-px bg-[#1e3320]" />

        {[
          { label: "Completadas", value: `${completadas.length}/${total}`, color: "text-[#f5f0e8]" },
          { label: "XP Total", value: `${xpTotal.toLocaleString("es-AR")} XP`, color: "text-[#c9a227]" },
          { label: "Nivel", value: String(nivel), color: "text-[#8fbc8f]" },
        ].map(({ label, value, color }) => (
          <div key={label} data-stat className="text-center">
            <p className="text-[9px] uppercase tracking-widest text-[#9aab8a]/60 mb-0.5">{label}</p>
            <p className={`text-sm font-bold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Misiones Activas ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={15} className="text-[#c9a227]" />
          <h3 className="font-serif text-xl text-[#f5f0e8]">Misiones Activas</h3>
          {pendientes.length > 0 && (
            <span className="ml-auto text-[10px] font-medium bg-[#c9a227]/10 text-[#c9a227] border border-[#c9a227]/20 px-2.5 py-0.5 rounded-full">
              {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {pendientes.length === 0 ? (
          <div className="flex items-center gap-3 p-6 rounded-xl bg-[#0F2411] border border-[#1e3320] text-[#9aab8a] text-sm italic">
            <Check size={16} className="text-[#8fbc8f] shrink-0" />
            Todo al día — no hay misiones pendientes en este bimestre.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Siempre visibles */}
            <div className="grid grid-cols-2 gap-3">
              {visible.map((m) => <MisionCard key={m.id} m={m} dataAttr="visible" />)}
            </div>

            {/* Expandibles */}
            {expanded && (
              <div ref={extraRef} className="grid grid-cols-2 gap-3">
                {hidden.map((m) => <MisionCard key={m.id} m={m} dataAttr="hidden" />)}
              </div>
            )}

            {/* Toggle button */}
            {hasMore && (
              <button
                onClick={handleToggle}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#1e3320] bg-[#0F2411] text-[11px] uppercase tracking-widest text-[#9aab8a] hover:text-[#c9a227] hover:border-[#c9a227]/30 transition-colors"
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
          <div className="flex items-center gap-2 mb-3">
            <Check size={14} className="text-[#8fbc8f]" />
            <h3 className="font-serif text-lg text-[#9aab8a]">Completadas este bimestre</h3>
            <span className="ml-auto text-[10px] text-[#9aab8a]/50 tabular-nums">
              {completadas.length} misión{completadas.length !== 1 ? "es" : ""}
            </span>
          </div>
          <div className="rounded-xl border border-[#1e3320] bg-[#0F2411] overflow-hidden">
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
                  className={`flex items-center gap-3 px-5 py-3 group ${i !== completadas.length - 1 ? "border-b border-[#1e3320]" : ""}`}
                >
                  <Check size={12} className="text-[#8fbc8f]/50 shrink-0" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9aab8a]/40 shrink-0 w-8">{m.tipo}</span>
                  <span className="text-sm text-[#f5f0e8]/50 truncate min-w-0">{m.title}</span>
                  {/* Leader dots */}
                  <span className="flex-1 border-b border-dotted border-[#1e3320] group-hover:border-[#9aab8a]/20 transition-colors mx-2 mb-0.5 min-w-4" />
                  {fechaEntrega && (
                    <span className="text-[10px] text-[#9aab8a]/30 tabular-nums shrink-0">{fechaEntrega}</span>
                  )}
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    <Zap size={10} className="text-[#8fbc8f]/40" />
                    <span className="text-[11px] text-[#8fbc8f]/50 tabular-nums">+{m.xpReward.toLocaleString("es-AR")} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {pendientes.length === 0 && completadas.length === 0 && (
        <p className="text-sm text-[#9aab8a]/60 text-center py-16">
          Sin misiones registradas para este bimestre.
        </p>
      )}
    </div>
  );
}
