import { auth } from "@/auth";
import { getVisibleCourseIds, getCourseById, getCourseworkConfig } from "@/lib/supabase/courses";
import { getAllDeliveriesForStudentByCourses, getStrikesForStudentByCourses } from "@/lib/supabase/game";
import { getStudentGameStateByEmail } from "@/lib/supabase/game";
import LaminasList from "@/laminas/components/LaminasList";
import type { Lamina, LaminaStatus } from "@/laminas/types";

function mapStatus(s: "OK" | "LATE" | "MISSING" | "PENDING"): LaminaStatus {
  if (s === "OK") return "entregada";
  if (s === "LATE") return "tardía";
  if (s === "PENDING") return "pendiente";
  return "no_entregada";
}

export default async function LaminasPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const visibleIds = await getVisibleCourseIds();

  const [deliveries, strikes, gameStates] = await Promise.all([
    getAllDeliveriesForStudentByCourses(email, visibleIds),
    getStrikesForStudentByCourses(email, visibleIds),
    getStudentGameStateByEmail(email),
  ]);

  // Determine active bimestre from the most recently updated game state
  const activeBimestre = gameStates.length > 0 ? gameStates[0].bimestre : "B1";

  // Build coursework name map: classroom_coursework_id → name
  const courseIds = [...new Set(deliveries.map((d) => d.course_id))];
  const configArrays = await Promise.all(courseIds.map((id) => getCourseworkConfig(id)));
  const nameMap = new Map<string, string>();
  for (const configs of configArrays) {
    for (const c of configs) {
      nameMap.set(c.classroom_coursework_id, c.name);
    }
  }

  // Build strike set: classroom_coursework_id values that generated a strike
  const strikeSet = new Set(
    strikes
      .filter((s) => s.classroom_coursework_id !== null)
      .map((s) => s.classroom_coursework_id as string)
  );

  const laminas: Lamina[] = deliveries.map((d) => ({
    id: d.id,
    productionType: d.tipo,
    title: nameMap.get(d.classroom_coursework_id) ?? d.tipo,
    bimestre: d.bimestre,
    dueDate: d.due_at ? new Date(d.due_at) : null,
    submittedAt: d.submitted_at ? new Date(d.submitted_at) : undefined,
    status: mapStatus(d.status),
    xpEarned: d.xp_base + d.xp_bonus > 0 ? d.xp_base + d.xp_bonus : undefined,
    isEarly: d.is_early,
    strikeAdded: strikeSet.has(d.classroom_coursework_id),
  }));

  return (
    <div className="w-full px-6 py-6 flex flex-col gap-8">
      <div>
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
          Registro de Producción
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#f5f0e8]">
          Láminas & Entregas
        </h1>
        <p className="mt-2 text-sm text-[#9aab8a] max-w-lg">
          Historial de todas tus entregas del ciclo lectivo. El estado de cada producción determina tu XP y tu nivel de strikes activos.
        </p>
      </div>

      <LaminasList laminas={laminas} activeBimestre={activeBimestre} />
    </div>
  );
}
