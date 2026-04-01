import type { XpConfigEntry, BimestreConfigEntry, TitleRange } from "@/lib/supabase/config";

interface Props {
  xpConfig: XpConfigEntry[];
  bimestreConfig: BimestreConfigEntry[];
  titleRanges: TitleRange[];
}

interface LevelThreshold {
  level: number;
  xpStart: number;
  xpEnd: number;
  title: string;
  role: string;
}

function calcThresholds(titleRanges: TitleRange[], totalXp: number): LevelThreshold[] {
  if (titleRanges.length === 0 || totalXp === 0) return [];

  const totalLevels = titleRanges.reduce(
    (acc, r) => acc + (r.level_max - r.level_min + 1),
    0
  );
  if (totalLevels === 0) return [];

  const xpPerLevel = totalXp / totalLevels;
  const thresholds: LevelThreshold[] = [];
  let cumulativeXp = 0;

  for (const range of titleRanges) {
    const levelsInRange = range.level_max - range.level_min + 1;
    for (let lvl = range.level_min; lvl <= range.level_max; lvl++) {
      const xpStart = Math.round(cumulativeXp);
      cumulativeXp += xpPerLevel;
      const xpEnd = Math.round(cumulativeXp);
      thresholds.push({
        level: lvl,
        xpStart,
        xpEnd,
        title: range.title,
        role: range.role,
      });
    }
    void levelsInRange;
  }

  return thresholds;
}

export default function XpProgressionCalculator({ xpConfig, bimestreConfig, titleRanges }: Props) {
  const xpMap = new Map(xpConfig.map((x) => [x.tipo, x.xp_base]));

  const bimestreXp = bimestreConfig
    .filter((b) => b.start_date && b.end_date)
    .map((b) => {
      const counts = b.task_counts ?? {};
      const total = Object.entries(counts).reduce(
        (acc, [tipo, qty]) => acc + (xpMap.get(tipo) ?? 0) * qty,
        0
      );
      return { bimestre: b.bimestre, xp: total, counts };
    });

  const totalXp = bimestreXp.reduce((acc, b) => acc + b.xp, 0);

  if (totalXp === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#1e3320] p-6 text-center text-xs text-[#9aab8a]">
        Configurá las fechas de bimestre y la cantidad de tareas por tipo para ver la proyección de XP.
      </div>
    );
  }

  const thresholds = calcThresholds(titleRanges, totalXp);

  // Group thresholds by title range for display
  const groupedByTitle = thresholds.reduce<
    Record<string, { title: string; role: string; levels: LevelThreshold[] }>
  >((acc, t) => {
    const key = `${t.title}-${t.role}`;
    if (!acc[key]) acc[key] = { title: t.title, role: t.role, levels: [] };
    acc[key].levels.push(t);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-5">
      {/* XP por bimestre */}
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5">
        <h4 className="mb-3 font-serif text-sm text-[#f5f0e8]">XP disponible por bimestre</h4>
        <div className="flex flex-col gap-2">
          {bimestreXp.map(({ bimestre, xp, counts }) => {
            const nonZero = Object.entries(counts).filter(([, qty]) => qty > 0);
            const pct = Math.round((xp / totalXp) * 100);
            return (
              <div key={bimestre} className="flex items-start gap-3">
                <span className="w-8 shrink-0 text-xs font-medium text-[#c9a227]">{bimestre}</span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 rounded-full bg-[#c9a227]/60"
                      style={{ width: `${pct}%`, minWidth: xp > 0 ? "4px" : "0" }}
                    />
                    <span className="font-mono text-xs text-[#f5f0e8]">{xp} XP</span>
                  </div>
                  {nonZero.length > 0 && (
                    <p className="text-[10px] text-[#9aab8a]">
                      {nonZero.map(([tipo, qty]) => `${qty}×${tipo}`).join(" + ")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between border-t border-[#1e3320] pt-2">
            <span className="text-xs text-[#9aab8a]">XP total del año</span>
            <span className="font-mono text-base font-bold text-[#c9a227]">{totalXp} XP</span>
          </div>
        </div>
      </div>

      {/* Distribución automática por título/rol */}
      {thresholds.length > 0 ? (
        <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5">
          <h4 className="mb-3 font-serif text-sm text-[#f5f0e8]">
            Distribución automática de XP por nivel
          </h4>
          <p className="mb-4 text-xs text-[#9aab8a]">
            XP distribuida equitativamente ({Math.round(totalXp / (thresholds.length || 1))} XP/nivel)
          </p>

          <div className="flex flex-col gap-3">
            {Object.values(groupedByTitle).map(({ title, role, levels }) => {
              const xpStart = levels[0].xpStart;
              const xpEnd = levels[levels.length - 1].xpEnd;
              const levelMin = levels[0].level;
              const levelMax = levels[levels.length - 1].level;

              return (
                <div
                  key={`${title}-${role}`}
                  className="rounded-lg border border-[#1e3320] bg-[#0d1a0f] p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[#f5f0e8]">{title}</span>
                      <span className="ml-2 text-xs text-[#9aab8a]">— {role}</span>
                    </div>
                    <span className="text-xs text-[#9aab8a]">
                      Nv. {levelMin}
                      {levelMin !== levelMax ? `–${levelMax}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9aab8a]">
                      {xpStart} → {xpEnd} XP
                    </span>
                    <span className="text-[#c9a227]">{levels.length} nivel{levels.length !== 1 ? "es" : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        titleRanges.length === 0 && (
          <p className="text-xs text-[#9aab8a]">
            Definí rangos en "Configuración de Niveles, Títulos y Roles" para ver la distribución automática.
          </p>
        )
      )}
    </div>
  );
}
