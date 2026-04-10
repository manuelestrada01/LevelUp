import { auth } from "@/auth";
import { getVisibleCourseIds, getCourseworkConfig } from "@/lib/supabase/courses";
import { getAllDeliveriesForStudentByCourses, getStudentGameStateByEmail } from "@/lib/supabase/game";
import { getXpConfig } from "@/lib/supabase/config";
import MisionesGrid from "@/misiones/components/MisionesGrid";
import DashboardAnimatedWrapper from "@/dashboard/components/DashboardAnimatedWrapper";
import type { Mision, MisionStatus } from "@/misiones/types";

export default async function MisionesPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const visibleIds = await getVisibleCourseIds();

  const [deliveries, gameStates] = await Promise.all([
    getAllDeliveriesForStudentByCourses(email, visibleIds),
    getStudentGameStateByEmail(email),
  ]);

  const activeGameState = gameStates[0] ?? null;
  const activeBimestre = activeGameState?.bimestre ?? "B1";

  const courseIds = [...new Set(deliveries.map((d) => d.course_id))];
  const [configArrays, xpConfigEntries] = await Promise.all([
    Promise.all(courseIds.map((id) => getCourseworkConfig(id))),
    getXpConfig(),
  ]);

  const nameMap = new Map<string, { name: string; tipo: string }>();
  for (const configs of configArrays) {
    for (const c of configs) {
      nameMap.set(c.classroom_coursework_id, { name: c.name, tipo: c.tipo });
    }
  }

  const xpMap = new Map<string, number>();
  for (const entry of xpConfigEntries) {
    xpMap.set(entry.tipo, entry.xp_base);
  }

  const bimestreDeliveries = deliveries.filter((d) => d.bimestre === activeBimestre);

  const misiones: Mision[] = bimestreDeliveries.map((d) => {
    const config = nameMap.get(d.classroom_coursework_id);
    const tipo = config?.tipo ?? d.tipo;
    const title = config?.name ?? d.tipo;

    let status: MisionStatus;
    if (d.status === "OK") status = "completada";
    else if (d.status === "LATE") status = "atrasada";
    else status = "pendiente";

    const xpReward =
      d.status === "OK" ? d.xp_base + d.xp_bonus : xpMap.get(tipo) ?? 0;

    return {
      id: d.id,
      title,
      tipo,
      status,
      xpReward,
      dueAt: d.due_at ? new Date(d.due_at) : null,
      submittedAt: d.submitted_at ? new Date(d.submitted_at) : undefined,
    };
  });

  const pendientes = misiones
    .filter((m) => m.status === "pendiente" || m.status === "atrasada")
    .sort((a, b) => {
      if (!a.dueAt && !b.dueAt) return 0;
      if (!a.dueAt) return 1;
      if (!b.dueAt) return -1;
      return a.dueAt.getTime() - b.dueAt.getTime();
    });

  const completadas = misiones.filter((m) => m.status === "completada");

  return (
    <DashboardAnimatedWrapper>
      <div className="max-w-4xl mx-auto">
      <header className="pb-6 border-b border-[#1e3320] text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a] mb-1">
          Bimestre {activeBimestre}
        </p>
        <h1 className="font-serif text-4xl font-bold text-[#f5f0e8] tracking-tight">
          Tablón de Misiones
        </h1>
      </header>

      <MisionesGrid
        pendientes={pendientes}
        completadas={completadas}
        xpTotal={activeGameState?.xp_total ?? 0}
        nivel={activeGameState?.level ?? 1}
        total={misiones.length}
      />
      </div>
    </DashboardAnimatedWrapper>
  );
}
