import { auth } from "@/auth";
import { getVisibleCourseIds } from "@/lib/supabase/courses";
import { getDistinctionsForStudentByCourses } from "@/lib/supabase/teacher";
import { ALL_DISTINCTIONS, EarnedBadge } from "@/distinciones/types";
import BadgesGrid from "@/distinciones/components/BadgesGrid";

export default async function DistincionesPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const visibleIds = await getVisibleCourseIds();
  const grants = await getDistinctionsForStudentByCourses(email, visibleIds);

  const earnedIds = new Set(grants.map((g) => g.distinction_id));

  const earned: EarnedBadge[] = grants
    .map((g) => {
      const def = ALL_DISTINCTIONS.find((d) => d.id === g.distinction_id);
      if (!def) return null;
      return {
        ...def,
        earnedAt: new Date(g.granted_at),
        grantedBy: g.granted_by,
      };
    })
    .filter((b): b is EarnedBadge => b !== null);

  const locked = ALL_DISTINCTIONS.filter((d) => !earnedIds.has(d.id));

  return (
    <div className="w-full px-6 py-6 flex flex-col gap-8">
      <div>
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
          Logros del Gremio
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#f5f0e8]">
          Distinciones
        </h1>
        <p className="mt-2 text-sm text-[#9aab8a] max-w-lg">
          Insignias obtenidas a lo largo de tu recorrido. Cada distinción refleja un patrón de constancia, calidad o participación sostenida.
        </p>
      </div>

      <BadgesGrid earned={earned} locked={locked} />
    </div>
  );
}
