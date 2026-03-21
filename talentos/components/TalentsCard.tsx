import { Talent } from "@/talentos/types";

interface TalentsCardProps {
  talents: Talent[];
}

const TALENT_ICONS: Record<string, string> = {
  "mano-firme": "✋",
  "perseverancia-activa": "⏳",
  "espiritu-colaborador": "🤝",
  "resistencia-al-error": "🛡",
  "claridad-comunicativa": "💬",
  "dominio-instrumental": "⚙",
  "constancia-silenciosa": "🌿",
  "atencion-al-detalle": "🔍",
  "autogestion-del-aprendizaje": "📐",
  "liderazgo-servicial": "🌟",
  "enfoque-y-concentracion": "🎯",
};

export default function TalentsCard({ talents }: TalentsCardProps) {
  return (
    <div className="rounded-xl bg-[#1a2e1c] p-5 border border-[#1e3320]">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
        Talentos Activos
      </p>

      {talents.length === 0 ? (
        <p className="text-xs text-[#9aab8a]/60 py-4 text-center">
          Ningún talento activo aún.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className="flex flex-col gap-2 rounded-lg border border-[#1e3320] bg-[#0d1a0f]/40 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#c9a227]/10 text-sm leading-none">
                  {TALENT_ICONS[talent.id] ?? "✦"}
                </span>
                <p className="text-xs font-semibold text-[#f5f0e8] leading-tight">
                  {talent.name}
                </p>
              </div>
              <p className="text-[10px] leading-relaxed text-[#9aab8a]">
                {talent.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
