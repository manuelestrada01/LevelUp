import type { StudentGameState } from "@/lib/supabase/game";

interface Props {
  gameStates: StudentGameState[];
  bimestre: string;
}

export default function ResumenAcademico({ gameStates, bimestre }: Props) {
  const total = gameStates.length;
  const blocked = gameStates.filter((s) => s.blocked).length;
  const atRisk = gameStates.filter((s) => s.strikes_active === 2).length;
  const avgXp = total > 0 ? Math.round(gameStates.reduce((a, s) => a + s.xp_total, 0) / total) : 0;
  const avgLevel = total > 0 ? Math.round(gameStates.reduce((a, s) => a + s.level, 0) / total) : 0;

  const xpBuckets = [0, 200, 400, 600, 900, 1200, 99999];
  const xpLabels = ["0–200", "200–400", "400–600", "600–900", "900–1200", "1200+"];
  const xpDist = xpBuckets.slice(0, -1).map((min, i) => ({
    label: xpLabels[i],
    count: gameStates.filter((s) => s.xp_total >= min && s.xp_total < xpBuckets[i + 1]).length,
  }));
  const maxCount = Math.max(...xpDist.map((b) => b.count), 1);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-[#9aab8a]">Bimestre activo: <span className="text-[#c9a227]">{bimestre}</span></p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Alumnos", value: total },
          { label: "XP promedio", value: avgXp },
          { label: "Nivel promedio", value: avgLevel },
          { label: "En riesgo (2 strikes)", value: atRisk, danger: true },
          { label: "Bloqueados", value: blocked, danger: true },
        ].map(({ label, value, danger }) => (
          <div key={label} className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
            <p className="text-xs text-[#9aab8a]">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${danger && value > 0 ? "text-[#c0392b]" : "text-[#f5f0e8]"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* XP Distribution Bar Chart */}
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5">
        <h3 className="mb-4 text-sm font-medium text-[#f5f0e8]">Distribución de XP</h3>
        <div className="flex items-end gap-2 h-28">
          {xpDist.map(({ label, count }) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-[#9aab8a]">{count}</span>
              <div
                className="w-full rounded-t bg-[#c9a227]/70"
                style={{ height: `${Math.round((count / maxCount) * 80)}px`, minHeight: count > 0 ? "4px" : "0" }}
              />
              <span className="text-[10px] text-[#9aab8a]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strike distribution */}
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5">
        <h3 className="mb-4 text-sm font-medium text-[#f5f0e8]">Distribución de Strikes</h3>
        <div className="flex gap-4">
          {[0, 1, 2, 3].map((n) => {
            const count = gameStates.filter((s) => s.strikes_active === n).length;
            return (
              <div key={n} className="flex flex-col items-center gap-1">
                <span className={`text-xl font-bold ${n === 3 ? "text-[#c0392b]" : n === 2 ? "text-amber-400" : "text-[#8fbc8f]"}`}>
                  {count}
                </span>
                <span className="text-xs text-[#9aab8a]">{n} strike{n !== 1 ? "s" : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
