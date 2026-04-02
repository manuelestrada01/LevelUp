import { auth } from "@/auth";
import { getVisibleCourseIds, getCoursesByIds } from "@/lib/supabase/courses";
import { getCourseRanking } from "@/lib/supabase/comunidad";
import DashboardAnimatedWrapper from "@/dashboard/components/DashboardAnimatedWrapper";
import RankingList from "@/comunidad/components/RankingList";
import { Users } from "lucide-react";

export default async function ComunidadPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const visibleIds = await getVisibleCourseIds();
  const [ranking, courses] = await Promise.all([
    getCourseRanking(visibleIds),
    getCoursesByIds(visibleIds),
  ]);

  const courseName = courses[0]?.name ?? "Curso";

  return (
    <DashboardAnimatedWrapper>
      <header className="pb-6 border-b border-[#1e3320]">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
          {courseName}
        </p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-serif text-4xl font-bold text-[#f5f0e8] tracking-tight">
            Gremio del Conocimiento
          </h1>
          <div className="flex items-center gap-2 text-[#9aab8a]/60 text-sm">
            <Users size={14} strokeWidth={1.5} />
            <span>{ranking.length} estudiante{ranking.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-[#9aab8a] max-w-lg">
          Ranking de resonancia del gremio. Solo XP y nivel son visibles — el recorrido de cada uno es personal.
        </p>
      </header>

      <RankingList entries={ranking} currentEmail={email} />
    </DashboardAnimatedWrapper>
  );
}
