"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Lamina, LaminaStatus } from "@/laminas/types";

gsap.registerPlugin(useGSAP);

interface LaminasListProps {
  laminas: Lamina[];
  activeBimestre: string;
}

const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

const STATUS_CONFIG: Record<LaminaStatus, { label: string; color: string; border: string; bg: string }> = {
  entregada:    { label: "Entregada",    color: "text-[#c8a84b]",             border: "border-[rgba(160,125,55,0.35)]", bg: "bg-[rgba(160,125,55,0.08)]" },
  tardía:       { label: "Tardía",       color: "text-[rgba(212,140,23,0.8)]", border: "border-[rgba(212,140,23,0.3)]",  bg: "bg-[rgba(212,140,23,0.07)]" },
  pendiente:    { label: "Pendiente",    color: "text-[rgba(136,153,170,0.7)]", border: "border-[rgba(136,153,170,0.2)]", bg: "bg-[rgba(136,153,170,0.05)]" },
  no_entregada: { label: "No entregada", color: "text-[rgba(136,153,170,0.35)]", border: "border-[rgba(136,153,170,0.12)]", bg: "bg-[rgba(0,0,0,0.1)]" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function BimestreTable({ laminas }: { laminas: Lamina[] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
        border: "1px solid rgba(160,125,55,0.28)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.55)",
      }}
    >
      {/* Header row — desktop only */}
      <div className="hidden md:grid grid-cols-[72px_1fr_110px_110px_110px_72px] gap-4 border-b border-[rgba(160,125,55,0.15)] px-5 py-2.5">
        {["Tipo", "Tarea", "Vencimiento", "Entregado", "Estado", "XP"].map((col) => (
          <p key={col} className="text-[10px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.45)]">
            {col}
          </p>
        ))}
      </div>

      <div className="flex flex-col">
        {laminas.map((lamina, i) => {
          const status = STATUS_CONFIG[lamina.status];
          const isPending = lamina.status === "no_entregada" || lamina.status === "pendiente";
          return (
            <div
              key={lamina.id}
              data-row
              className={`transition-colors hover:bg-[rgba(200,168,75,0.02)] ${
                i !== laminas.length - 1 ? "border-b border-[rgba(160,125,55,0.1)]" : ""
              } ${isPending ? "opacity-45" : ""}`}
              style={{ opacity: 0 }}
            >
              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-[72px_1fr_110px_110px_110px_72px] gap-4 items-center px-5 py-3.5">
                <span className="w-fit px-2 py-0.5 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.6)] border border-[rgba(160,125,55,0.2)] bg-[rgba(160,125,55,0.06)]">
                  {lamina.productionType}
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-[17px] text-[rgba(232,224,208,0.8)] leading-tight truncate">{lamina.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {lamina.strikeAdded && <p className="text-[11px] font-serif text-danger uppercase tracking-wider">+1 Strike</p>}
                    {lamina.isEarly && <p className="text-[11px] font-serif text-[#c8a84b]/70 uppercase tracking-wider">◆ Anticipada</p>}
                  </div>
                </div>
                <p className="font-serif text-[15px] text-[rgba(160,125,55,0.45)]">{lamina.dueDate ? formatDate(lamina.dueDate) : "—"}</p>
                <p className="font-serif text-[15px] text-[rgba(160,125,55,0.45)]">{lamina.submittedAt ? formatDate(lamina.submittedAt) : "—"}</p>
                <span className={`w-fit border px-2 py-0.5 text-[11px] font-serif ${status.bg} ${status.border} ${status.color}`}>
                  {status.label}
                </span>
                <p className={`font-serif text-[17px] font-bold tabular-nums ${lamina.xpEarned ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.25)]"}`}>
                  {lamina.xpEarned ? `+${lamina.xpEarned}` : "—"}
                </p>
              </div>

              {/* Mobile card */}
              <div className="md:hidden flex flex-col gap-2 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.6)] border border-[rgba(160,125,55,0.2)] bg-[rgba(160,125,55,0.06)]">
                      {lamina.productionType}
                    </span>
                    <span className={`border px-2 py-0.5 text-[11px] font-serif ${status.bg} ${status.border} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className={`font-serif text-[17px] font-bold tabular-nums shrink-0 ${lamina.xpEarned ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.25)]"}`}>
                    {lamina.xpEarned ? `+${lamina.xpEarned} XP` : "—"}
                  </p>
                </div>
                <p className="font-serif text-[15px] text-[rgba(232,224,208,0.8)] leading-snug">{lamina.title}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {lamina.dueDate && (
                    <p className="text-[11px] font-serif text-[rgba(160,125,55,0.4)] uppercase tracking-wider">
                      Vence: {formatDate(lamina.dueDate)}
                    </p>
                  )}
                  {lamina.submittedAt && (
                    <p className="text-[11px] font-serif text-[rgba(160,125,55,0.4)] uppercase tracking-wider">
                      Entregado: {formatDate(lamina.submittedAt)}
                    </p>
                  )}
                  {lamina.strikeAdded && <p className="text-[11px] font-serif text-danger uppercase tracking-wider">+1 Strike</p>}
                  {lamina.isEarly && <p className="text-[11px] font-serif text-[#c8a84b]/70 uppercase tracking-wider">◆ Anticipada</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LaminasList({ laminas, activeBimestre }: LaminasListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const active = laminas.filter((l) => l.bimestre === activeBimestre);
  const previous = laminas.filter((l) => l.bimestre !== activeBimestre);
  const previousBimestres = [...new Set(previous.map((l) => l.bimestre))].sort();

  const totalXp = laminas.reduce((sum, l) => sum + (l.xpEarned ?? 0), 0);
  const strikesGenerados = laminas.filter((l) => l.strikeAdded).length;
  const pendientes = laminas.filter((l) => l.status === "no_entregada").length;

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-seal]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.38, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        "[data-row]",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.32, ease: "power2.out", delay: 0.25 }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-8">

      {/* ── Summary seals ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "XP Acumulada",      value: totalXp.toLocaleString("es-AR") + " XP", color: "text-[#c8a84b] gold-glow-sm" },
          { label: "Strikes Generados",  value: String(strikesGenerados),                 color: "text-danger" },
          { label: "Pendientes",         value: String(pendientes),                       color: "text-[rgba(136,153,170,0.6)]" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            data-seal
            className="relative p-4 overflow-hidden flex flex-col items-center justify-center"
            style={{
              opacity: 0,
              background: `${STONE_NOISE}, linear-gradient(170deg, #141209 0%, #0e0d07 100%)`,
              border: "1px solid rgba(160,125,55,0.28)",
            }}
          >
            <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.07)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(200,148,40,0.05)_0%,transparent_55%)]" />
            <p className="relative text-[10px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.45)] mb-1.5 text-center">{label}</p>
            <p className={`relative font-serif text-[30px] font-bold text-center ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Bimestre activo ── */}
      {active.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="gold-divider w-6" />
            <p className="text-[11px] font-serif uppercase tracking-[0.28em] text-[#c8a84b] shrink-0">
              {activeBimestre}
            </p>
            <span className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(200,168,75,0.6)] border border-[rgba(160,125,55,0.28)] bg-[rgba(160,125,55,0.08)] px-2 py-0.5">
              Activo
            </span>
            <div className="gold-divider flex-1" />
          </div>
          <BimestreTable laminas={active} />
        </section>
      )}

      {/* ── Bimestres anteriores ── */}
      {previousBimestres.map((bim) => {
        const rows = previous.filter((l) => l.bimestre === bim);
        return (
          <section key={bim} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-gradient-to-r from-transparent to-[rgba(160,125,55,0.2)]" />
              <p className="text-[11px] font-serif uppercase tracking-[0.25em] text-[rgba(160,125,55,0.35)] shrink-0">{bim}</p>
              <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.2)] to-transparent" />
            </div>
            <BimestreTable laminas={rows} />
          </section>
        );
      })}

      {laminas.length === 0 && (
        <p className="font-serif text-[17px] italic text-[rgba(160,125,55,0.4)] text-center py-12">
          Todavía no hay entregas registradas.
        </p>
      )}
    </div>
  );
}
