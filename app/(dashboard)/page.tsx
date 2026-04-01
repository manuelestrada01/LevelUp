import { auth } from "@/auth";
import { getProfile } from "@/lib/supabase/profiles";
import { getStudentGameStateByEmail, getDeliveriesByStudentEmail } from "@/lib/supabase/game";
import { getTalentsForStudent } from "@/lib/supabase/teacher";
import { getVisibleCourseIds } from "@/lib/supabase/courses";
import { getFormativeClasses } from "@/lib/supabase/classes";
import { getLevelRange, XP_THRESHOLDS } from "@/xp/engine";
import HeroSection from "@/dashboard/components/HeroSection";
import ActivityFeed from "@/dashboard/components/ActivityFeed";
import DashboardAnimatedWrapper from "@/dashboard/components/DashboardAnimatedWrapper";
import XpCard from "@/xp/components/XpCard";
import StrikesCard from "@/strikes/components/StrikesCard";
import TalentsCard from "@/talentos/components/TalentsCard";
import ClassesSection from "@/clases-formativas/components/ClassesSection";
import { ALL_TALENTS } from "@/talentos/types";
import { ActivityEntry } from "@/xp/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;
  const session = await auth();
  const email = session?.user?.email ?? "";
  const defaultName = session?.user?.name?.split(" ")[0] ?? "Estudiante";

  let studentName = defaultName;
  let formativeClassSlug = "erudito";
  let xp = 0;
  let xpCurrentLevel = 0;
  let xpNextLevel = 520;
  let level = 1;
  let levelName = "Iniciación";
  let nextLevelName = "Fundamentos";
  let strikes = 0;
  let blocked = false;
  let activity: ActivityEntry[] = [];
  let grantedTalentIds: string[] = [];

  if (email) {
    const [profile, allGameStates, deliveries, visibleIds] = await Promise.all([
      getProfile(email),
      getStudentGameStateByEmail(email),
      getDeliveriesByStudentEmail(email, 5),
      getVisibleCourseIds(),
    ]);

    const visibleGameStates = allGameStates.filter((s) => visibleIds.includes(s.course_id));
    const gameStates = courseId
      ? visibleGameStates.filter((s) => s.course_id === courseId)
      : visibleGameStates;

    if (profile) {
      formativeClassSlug = profile.formative_class;
      studentName = profile.display_name ?? defaultName;
    }

    if (gameStates.length > 0) {
      const state = gameStates[0];
      xp = state.xp_total;
      level = state.level;
      strikes = state.strikes_active;
      blocked = state.blocked;
      xpCurrentLevel = XP_THRESHOLDS[level - 1] ?? 0;
      xpNextLevel = XP_THRESHOLDS[level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
      const range = getLevelRange(level);
      levelName = range.title;
      nextLevelName = range.nextTitle;

      try {
        const talentGrants = await getTalentsForStudent(state.course_id, email);
        grantedTalentIds = talentGrants.map((t) => t.talent_id);
      } catch {
        // no talents yet
      }
    }

    activity = deliveries.map((d) => ({
      id: d.id,
      type: d.is_early ? ("xp_silent" as const) : ("xp_base" as const),
      description: `${d.tipo} entregada`,
      xpDelta: d.xp_base + d.xp_bonus,
      timestamp: d.submitted_at ? new Date(d.submitted_at) : new Date(d.synced_at),
      productionType: d.tipo as ActivityEntry["productionType"],
    }));
  }

  const [publishedClasses] = await Promise.all([getFormativeClasses(true)]);
  const activeClassEntry = publishedClasses.find((c) => c.slug === formativeClassSlug) ?? null;

  const talents = grantedTalentIds.length > 0
    ? ALL_TALENTS.filter((t) => grantedTalentIds.includes(t.id))
    : ALL_TALENTS.filter((t) =>
        ["mano-firme", "perseverancia-activa", "constancia-silenciosa", "atencion-al-detalle"].includes(t.id)
      );

  return (
    <DashboardAnimatedWrapper>
      <HeroSection studentName={studentName} classEntry={activeClassEntry} />

      <div className="grid grid-cols-[3fr_1fr] gap-4">
        <XpCard
          xp={xp}
          xpCurrentLevel={xpCurrentLevel}
          xpNextLevel={xpNextLevel}
          level={level}
          levelName={levelName}
          nextLevelName={nextLevelName}
          studentName={studentName}
          blocked={blocked}
        />
        <StrikesCard strikes={strikes} blocked={blocked} />
      </div>

      <div className="grid grid-cols-[2fr_3fr] gap-4">
        <ActivityFeed entries={activity} />
        <TalentsCard talents={talents} />
      </div>

      <ClassesSection activeClassSlug={formativeClassSlug} classes={publishedClasses} />
    </DashboardAnimatedWrapper>
  );
}
