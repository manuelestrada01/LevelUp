import { Mision, MisionType, MisionStatus } from "@/misiones/types";
import { ArrowRight, Check, Clock } from "lucide-react";

interface MisionesGridProps {
  misiones: Mision[];
}

const TYPE_CONFIG: Record<MisionType, { label: string; color: string }> = {
  intracurso:  { label: "Intracurso",  color: "bg-[#1e3320] text-[#9aab8a]" },
  intercurso:  { label: "Intercurso",  color: "bg-[#c9a227]/15 text-[#c9a227]" },
  interarea:   { label: "Interárea",   color: "bg-[#8fbc8f]/15 text-[#8fbc8f]" },
  comunidad:   { label: "Comunidad",   color: "bg-[#1e3320] text-[#9aab8a]" },
};

function formatExpiry(date: Date): string {
  const now = new Date();
  const diffH = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));
  if (diffH < 24) return `Expira en ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `Expira en ${diffD} día${diffD > 1 ? "s" : ""}`;
}

export default function MisionesGrid({ misiones }: MisionesGridProps) {
  const active = misiones.filter((m) => m.status === "activa");
  const completed = misiones.filter((m) => m.status === "completada");

  return (
    <div className="flex flex-col gap-8">
      {/* Active */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-serif text-xl font-bold text-[#f5f0e8]">Activas</h2>
          <span className="rounded-full bg-[#c9a227]/20 px-2.5 py-0.5 text-xs font-semibold text-[#c9a227]">
            {active.length}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {active.map((mision) => {
            const type = TYPE_CONFIG[mision.type];
            return (
              <div
                key={mision.id}
                className="flex flex-col gap-3 rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${type.color}`}>
                    {type.label}
                  </span>
                  <span className="font-serif text-sm font-bold text-[#c9a227]">
                    +{mision.xpReward.toLocaleString("es-AR")} XP
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-[#f5f0e8] leading-tight">
                    {mision.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-[#9aab8a]">
                    {mision.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-1">
                  {mision.expiresAt ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#9aab8a]/60 uppercase tracking-wider">
                      <Clock size={10} />
                      {formatExpiry(mision.expiresAt)}
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#9aab8a]/40 uppercase tracking-wider">Sin vencimiento</span>
                  )}
                  <button className="flex items-center gap-1.5 rounded-lg bg-[#1e3320] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#9aab8a] transition-colors hover:bg-[#243d26] hover:text-[#f5f0e8]">
                    Ver <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-serif text-xl font-bold text-[#f5f0e8]/40">Completadas</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {completed.map((mision) => {
              const type = TYPE_CONFIG[mision.type];
              return (
                <div
                  key={mision.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#1e3320] bg-[#1a2e1c]/60 p-5 opacity-60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${type.color}`}>
                      {type.label}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8fbc8f]">
                      <Check size={12} />
                      +{mision.xpReward} XP
                    </div>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#f5f0e8] leading-tight">
                    {mision.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-[#9aab8a]">
                    {mision.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
