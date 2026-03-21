const MAX_STRIKES = 3;

interface StrikesCardProps {
  strikes: number;
  blocked?: boolean;
}

const STRIKE_MESSAGES: Record<number, string> = {
  0: "Sin incumplimientos activos. El camino está despejado.",
  1: "1/3 Activos. Mantén la rectitud técnica para evitar la purga de privilegios.",
  2: "2/3 Activos. Un incumplimiento más bloqueará el bimestre.",
  3: "3/3 Activos. Bimestre bloqueado. Regulariza tu situación para continuar.",
};

export default function StrikesCard({ strikes, blocked = false }: StrikesCardProps) {
  const clamped = Math.min(strikes, MAX_STRIKES);
  const message = STRIKE_MESSAGES[clamped] ?? STRIKE_MESSAGES[3];

  return (
    <div
      className={`rounded-xl p-5 border ${
        blocked
          ? "bg-[#c0392b]/10 border-[#c0392b]/30"
          : "bg-[#1a2e1c] border-[#1e3320]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
          Strikes Académicos
        </p>
        {clamped >= 2 && (
          <span className="text-[#c9a227] text-sm">⚠</span>
        )}
      </div>

      {/* Strike icons */}
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: MAX_STRIKES }).map((_, i) => {
          const isActive = i < clamped;
          return (
            <div
              key={i}
              className={`flex h-14 flex-1 items-center justify-center rounded-lg border text-base font-bold transition-colors ${
                isActive
                  ? "border-[#c0392b] bg-[#c0392b]/20 text-[#c0392b]"
                  : "border-[#1e3320] bg-[#0d1a0f]/60 text-[#1e3320]"
              }`}
            >
              ✕
            </div>
          );
        })}
      </div>

      {/* Message */}
      <p className="text-[11px] leading-relaxed text-[#9aab8a]">{message}</p>
    </div>
  );
}
