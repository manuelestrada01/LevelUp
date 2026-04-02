import { supabase } from "./client";

export interface RankingEntry {
  email: string;
  displayName: string;
  formativeClass: string;
  xpTotal: number;
  level: number;
  position: number;
}

export async function getCourseRanking(courseIds: string[]): Promise<RankingEntry[]> {
  if (!courseIds.length) return [];

  const { data: states, error: statesError } = await supabase
    .from("student_game_state")
    .select("student_email, course_id, xp_total, level")
    .in("course_id", courseIds);

  if (statesError || !states?.length) return [];

  // Aggregate per student: sum XP across bimestres, keep max level
  const map = new Map<string, { xpTotal: number; level: number }>();
  for (const s of states) {
    const existing = map.get(s.student_email);
    if (!existing) {
      map.set(s.student_email, { xpTotal: s.xp_total, level: s.level });
    } else {
      map.set(s.student_email, {
        xpTotal: existing.xpTotal + s.xp_total,
        level: Math.max(existing.level, s.level),
      });
    }
  }

  const emails = [...map.keys()];

  const { data: profiles } = await supabase
    .from("student_profiles")
    .select("email, display_name, formative_class")
    .in("email", emails);

  const profileMap = new Map(profiles?.map((p) => [p.email, p]) ?? []);

  const entries = emails.map((email) => {
    const agg = map.get(email)!;
    const profile = profileMap.get(email);
    return {
      email,
      displayName: profile?.display_name ?? email.split("@")[0],
      formativeClass: profile?.formative_class ?? "erudito",
      xpTotal: agg.xpTotal,
      level: agg.level,
      position: 0,
    };
  });

  entries.sort((a, b) => b.xpTotal - a.xpTotal);
  entries.forEach((e, i) => { e.position = i + 1; });

  return entries;
}
