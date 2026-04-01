import type { StudentGameState } from "@/lib/supabase/game";
import { getProfilesFull } from "@/lib/supabase/profiles";
import { getFormativeClasses } from "@/lib/supabase/classes";
import ResumenAcademicoDisplay from "./ResumenAcademicoDisplay";

interface Props {
  gameStates: StudentGameState[];
  bimestre: string;
}

export default async function ResumenAcademico({ gameStates, bimestre }: Props) {
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

  const emails = gameStates.map((s) => s.student_email);
  const [profiles, formativeClasses] = await Promise.all([
    getProfilesFull(emails),
    getFormativeClasses(),
  ]);

  const classMap = new Map(formativeClasses.map((c) => [c.slug, c.title]));
  const classCounts = new Map<string, number>();
  for (const profile of profiles.values()) {
    if (!profile.formative_class) continue;
    classCounts.set(profile.formative_class, (classCounts.get(profile.formative_class) ?? 0) + 1);
  }
  const topClasses = [...classCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug, count]) => ({ slug, title: classMap.get(slug) ?? slug, count }));

  const strikeDist = [0, 1, 2, 3].map((n) => ({
    n,
    count: gameStates.filter((s) => s.strikes_active === n).length,
  }));

  return (
    <ResumenAcademicoDisplay
      bimestre={bimestre}
      total={total}
      avgXp={avgXp}
      avgLevel={avgLevel}
      atRisk={atRisk}
      blocked={blocked}
      xpDist={xpDist}
      maxCount={maxCount}
      topClasses={topClasses}
      strikeDist={strikeDist}
    />
  );
}
