"use client";

import { Mision } from "@/misiones/types";
import { ArrowRight, Check, Plus } from "lucide-react";

interface MisionesGridProps {
  misiones: Mision[];
}

const STATUS_CONFIG = {
  activa: { label: "En Curso", className: "bg-[#8fbc8f]/10 text-[#8fbc8f] border border-[#8fbc8f]/30" },
  completada: { label: "Completada", className: "bg-[#c9a227]/10 text-[#c9a227] border border-[#c9a227]/30" },
  expirada: { label: "Disponible", className: "bg-[#c9a227]/10 text-[#c9a227] border border-[#c9a227]/30" },
};

export default function MisionesGrid({ misiones }: MisionesGridProps) {
  const principales = misiones.filter((m) => m.category === "gremio" && m.status !== "completada");
  const completadas = misiones.filter((m) => m.status === "completada");

  return (
    <div className="flex flex-col gap-12">
      {/* Header sección */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#c9a227]" style={{ fontVariationSettings: "'FILL' 1" }}>
          workspace_premium
        </span>
        <h3 className="font-serif text-2xl text-[#f5f0e8]">Misiones de Gremio (Principales)</h3>
      </div>

      {/* Cards principales en grid 2 col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {principales.map((mision) => {
          const status = STATUS_CONFIG[mision.status];
          const accentColor = mision.status === "activa" ? "#8fbc8f" : "#c9a227";
          return (
            <div
              key={mision.id}
              className="group relative bg-[#1a2e1c]/80 backdrop-blur-xl border-t border-[#8fbc8f]/20 p-8 rounded-lg transition-all hover:bg-[#1e3320] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              {/* Badge status */}
              <div className="absolute top-0 right-0 p-4">
                <span className={`inline-flex items-center px-3 py-1 text-[10px] font-medium uppercase tracking-tight rounded-sm ${status.className}`}>
                  {status.label}
                </span>
              </div>

              <div className="mb-6">
                {mision.icon && (
                  <span
                    className="material-symbols-outlined text-4xl mb-4 block"
                    style={{ color: accentColor }}
                  >
                    {mision.icon}
                  </span>
                )}
                <h4
                  className="font-serif text-2xl font-semibold text-[#f5f0e8] transition-colors leading-tight"
                  style={{ ["--tw-group-hover-color" as string]: "#c9a227" }}
                >
                  {mision.title}
                </h4>
                <p className="text-sm text-[#9aab8a] mt-2 leading-relaxed">{mision.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-[#424842]/30 pt-6">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#8fbc8f]/60">Recompensa</p>
                    <p className="text-[#8fbc8f] font-serif text-lg">+{mision.xpReward.toLocaleString("es-AR")} XP</p>
                  </div>
                  {mision.bonusXp && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#c9a227]/60">Bonus</p>
                      <p className="text-[#c9a227] font-serif text-lg">+{mision.bonusXp.toLocaleString("es-AR")} XP</p>
                    </div>
                  )}
                </div>
                <button className="bg-[#243a25] p-2 rounded hover:bg-[#8fbc8f] hover:text-[#0d1a0f] transition-all">
                  {mision.status === "activa" ? <ArrowRight size={20} /> : <Plus size={20} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Misiones cumplidas */}
      {completadas.length > 0 && (
        <div className="mt-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#9aab8a]">task_alt</span>
            <h3 className="font-serif text-xl text-[#9aab8a]">Misiones Cumplidas</h3>
          </div>
          <div className="flex flex-col gap-3">
            {completadas.map((mision) => (
              <div
                key={mision.id}
                className="bg-[#0d1a0f] flex items-center justify-between p-4 rounded border-l-2 border-[#8fbc8f]/20"
              >
                <div className="flex items-center gap-4">
                  <Check size={16} className="text-[#8fbc8f]" />
                  <span className="text-sm text-[#f5f0e8]">{mision.title}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8fbc8f]/50">
                  +{mision.xpReward.toLocaleString("es-AR")} XP RECLAMADO
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
