import { Mision } from "@/misiones/types";
import { ChevronRight } from "lucide-react";

const ICON_MAP: Record<string, string> = {
  architecture: "architecture",
  description: "description",
  brush: "brush",
  default: "task",
};

interface EncargosSemanalesProps {
  encargos: Mision[];
}

export default function EncargosSemanales({ encargos }: EncargosSemanalesProps) {
  return (
    <div className="bg-[#1a2e1c]/40 border border-[#424842]/10 p-8 rounded-lg">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-[#cabff9]">history_edu</span>
        <h3 className="font-serif text-xl text-[#f5f0e8]">Encargos Semanales</h3>
      </div>

      <div className="flex flex-col gap-2">
        {encargos.map((encargo) => (
          <div
            key={encargo.id}
            className="group flex items-start gap-4 p-4 hover:bg-[#8fbc8f]/5 transition-colors rounded cursor-pointer"
          >
            <div className="bg-[#243a25] text-[#cabff9] p-3 rounded">
              <span className="material-symbols-outlined">
                {encargo.icon ? (ICON_MAP[encargo.icon] ?? ICON_MAP.default) : ICON_MAP.default}
              </span>
            </div>
            <div className="flex-1">
              <h5 className="font-sans font-bold text-sm text-[#f5f0e8]">{encargo.title}</h5>
              <p className="text-xs text-[#9aab8a] mt-1">{encargo.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[#8fbc8f] font-serif text-sm">+{encargo.xpReward} XP</span>
                <ChevronRight
                  size={16}
                  className="text-[#9aab8a] transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-4 border border-[#cabff9]/30 text-[#cabff9] text-[10px] uppercase tracking-[0.2em] hover:bg-[#cabff9]/10 transition-colors rounded-sm">
        Ver Archivo de Encargos
      </button>
    </div>
  );
}
