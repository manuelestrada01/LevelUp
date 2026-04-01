import { auth } from "@/auth";
import { getVisibleCourseIds, getCourseworkConfig } from "@/lib/supabase/courses";
import { getAllDeliveriesForStudentByCourses, getStudentGameStateByEmail } from "@/lib/supabase/game";
import { getXpConfig } from "@/lib/supabase/config";
import MisionesGrid from "@/misiones/components/MisionesGrid";
import ProgresoSidebar from "@/misiones/components/ProgresoSidebar";
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
    <div className="w-full px-12 py-12 min-h-screen">
      <header className="mb-12">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a] mb-1">
          Bimestre {activeBimestre}
        </p>
        <h1 className="font-serif text-5xl font-bold text-[#f5f0e8] tracking-tight mb-2">
          Tablón de Misiones
        </h1>
        <p className="text-[#8fbc8f]/70 text-lg max-w-xl">
          Desafíos activos del ciclo académico. Completa tus misiones para ganar Resonancia de Experiencia.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        <section className="col-span-12 lg:col-span-8">
          <MisionesGrid pendientes={pendientes} completadas={completadas} />
        </section>

        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <ProgresoSidebar
            total={misiones.length}
            completadas={completadas.length}
            xpTotal={activeGameState?.xp_total ?? 0}
            nivel={activeGameState?.level ?? 1}
            strikesActivos={activeGameState?.strikes_active ?? 0}
            bimestre={activeBimestre}
          />

          <div className="relative overflow-hidden bg-gradient-to-br from-[#785600]/40 to-[#1a2e1c] p-6 rounded-lg border border-[#c9a227]/10">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-[#c9a227] mb-3 block">
                auto_awesome
              </span>
              <p className="font-serif italic text-[#c9a227] text-lg leading-snug">
                &ldquo;Un trazo firme en la lámina refleja un alma decidida en el bosque.&rdquo;
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#c9a227]/60 mt-4">
                Consejo de los Ancianos
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-10">
              <span
                className="material-symbols-outlined text-[120px] text-[#c9a227]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                history_edu
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
