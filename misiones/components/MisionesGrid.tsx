"use client";

import { Mision } from "@/misiones/types";
import { Check, AlertCircle, Clock } from "lucide-react";

function deadlineInfo(dueAt: Date | null): { text: string; urgent: boolean; overdue: boolean } {
  if (!dueAt) return { text: "Sin fecha límite", urgent: false, overdue: false };
  const diff = Math.ceil((dueAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0)
    return {
      text: `Venció hace ${Math.abs(diff)} día${Math.abs(diff) === 1 ? "" : "s"}`,
      urgent: false,
      overdue: true,
    };
  if (diff === 0) return { text: "Vence hoy", urgent: true, overdue: false };
  if (diff === 1) return { text: "Vence mañana", urgent: true, overdue: false };
  if (diff <= 4) return { text: `Vence en ${diff} días`, urgent: true, overdue: false };
  return { text: `Vence en ${diff} días`, urgent: false, overdue: false };
}

interface Props {
  pendientes: Mision[];
  completadas: Mision[];
}

export default function MisionesGrid({ pendientes, completadas }: Props) {
  return (
    <div className="flex flex-col gap-10">
      {/* Pendientes */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span
            className="material-symbols-outlined text-[#c9a227]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            workspace_premium
          </span>
          <h3 className="font-serif text-2xl text-[#f5f0e8]">Misiones Activas</h3>
          {pendientes.length > 0 && (
            <span className="ml-auto text-xs font-medium bg-[#c9a227]/10 text-[#c9a227] border border-[#c9a227]/20 px-2.5 py-0.5 rounded-full">
              {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {pendientes.length === 0 ? (
          <div className="flex items-center gap-3 p-6 rounded-lg bg-[#1a2e1c]/40 border border-[#8fbc8f]/10 text-[#9aab8a] text-sm italic">
            <Check size={18} className="text-[#8fbc8f] shrink-0" />
            Todo al día — no hay misiones pendientes en este bimestre.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pendientes.map((m) => {
              const dl = deadlineInfo(m.dueAt);
              const borderColor = dl.overdue
                ? "border-[#c0392b]"
                : dl.urgent
                ? "border-[#c9a227]"
                : "border-[#8fbc8f]/30";
              return (
                <div
                  key={m.id}
                  className={`bg-[#1a2e1c]/80 border-l-2 rounded-lg p-5 transition-colors hover:bg-[#1e3320] ${borderColor}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10px] uppercase tracking-widest font-medium text-[#9aab8a] bg-[#243a25] px-2 py-0.5 rounded">
                          {m.tipo}
                        </span>
                        {(dl.urgent || dl.overdue) && (
                          <span
                            className={`flex items-center gap-1 text-[10px] uppercase tracking-wide font-medium ${
                              dl.overdue ? "text-[#c0392b]" : "text-[#c9a227]"
                            }`}
                          >
                            <AlertCircle size={11} />
                            {dl.overdue ? "Atrasada" : "Urgente"}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-lg text-[#f5f0e8] leading-snug">
                        {m.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[#8fbc8f] font-serif text-base">
                        +{m.xpReward.toLocaleString("es-AR")} XP
                      </p>
                      <p
                        className={`text-xs mt-1 flex items-center gap-1 justify-end ${
                          dl.overdue ? "text-[#c0392b]/80" : "text-[#9aab8a]"
                        }`}
                      >
                        <Clock size={11} />
                        {dl.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Completadas */}
      {completadas.length > 0 && (
        <section className="opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#9aab8a]">task_alt</span>
            <h3 className="font-serif text-xl text-[#9aab8a]">Completadas este bimestre</h3>
          </div>
          <div className="flex flex-col gap-2">
            {completadas.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-[#0d1a0f] p-4 rounded border-l-2 border-[#8fbc8f]/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Check size={15} className="text-[#8fbc8f] shrink-0" />
                  <span className="text-sm text-[#f5f0e8] truncate">{m.title}</span>
                  <span className="text-[10px] text-[#9aab8a] uppercase shrink-0">{m.tipo}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8fbc8f]/60 shrink-0 ml-4">
                  +{m.xpReward.toLocaleString("es-AR")} XP
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
