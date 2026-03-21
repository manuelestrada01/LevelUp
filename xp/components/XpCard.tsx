interface XpCardProps {
  xp: number;
  xpCurrentLevel: number;
  xpNextLevel: number;
  level: number;
  levelName: string;
  nextLevelName: string;
  studentName: string;
  blocked?: boolean;
}

function formatXp(value: number): string {
  return value.toLocaleString("es-AR");
}

export default function XpCard({
  xp,
  xpCurrentLevel,
  xpNextLevel,
  level,
  levelName,
  nextLevelName,
  studentName,
  blocked = false,
}: XpCardProps) {
  const progress = Math.min(
    ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100,
    100
  );

  return (
    <div className="rounded-xl bg-[#1a2e1c] p-5 border border-[#1e3320]">
      {/* Header: label + XP value */}
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
          Resonancia de Experiencia
        </p>
        <div className="text-right">
          <span className="font-serif text-2xl font-bold text-[#c9a227]">
            {formatXp(xp)}
          </span>
          <span className="ml-1.5 text-xs font-semibold uppercase tracking-wider text-[#9aab8a]">
            XP
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="mb-3 text-[10px] uppercase tracking-wider text-[#9aab8a]/70">
        Nivel {level} · {studentName}
        {blocked && (
          <span className="ml-2 text-[#c0392b]">· Bimestre bloqueado</span>
        )}
      </p>

      {/* Progress bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#0d1a0f]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            blocked
              ? "bg-[#c0392b]/60"
              : "bg-gradient-to-r from-[#4a8f5a] via-[#8fbc8f] to-[#c9a227]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom stats */}
      <div className="mt-3 flex justify-between">
        <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]/70">
          Siguiente hito: {formatXp(xpNextLevel)} XP
        </p>
        <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]">
          {Math.round(progress)}% Completado
        </p>
      </div>
    </div>
  );
}
