import { auth } from "@/auth";
import { getCoursesByTeacher } from "@/lib/supabase/courses";
import { getAllStudentGameStates } from "@/lib/supabase/game";
import { getFormativeClasses } from "@/lib/supabase/classes";
import { getTalentConfig } from "@/lib/supabase/config";
import FormativeClassEditor from "@/docente/components/FormativeClassEditor";
import TalentConfigEditor from "@/docente/components/TalentConfigEditor";
import TeacherAnimatedWrapper from "@/docente/components/TeacherAnimatedWrapper";
import AnimatedStatCard from "@/docente/components/AnimatedStatCard";
import AtRiskTable from "@/docente/components/AtRiskTable";

export default async function TeacherDashboardPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const [courses, formativeClasses, talentConfig] = await Promise.all([
    getCoursesByTeacher(email),
    getFormativeClasses(),
    getTalentConfig(),
  ]);

  const allStates = (
    await Promise.all(
      courses.map((c) => getAllStudentGameStates(c.id, c.bimestre_activo))
    )
  ).flat();

  const atRisk = allStates.filter((s) => s.strikes_active >= 2 || s.blocked);
  const totalStudents = allStates.length;

  const lastSync =
    allStates.length > 0
      ? allStates.reduce((a, b) =>
          new Date(a.updated_at) > new Date(b.updated_at) ? a : b
        ).updated_at
      : null;

  return (
    <TeacherAnimatedWrapper>
      {/* Page heading */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.45)] to-transparent" />
          <span className="text-[11px] font-serif uppercase tracking-[0.38em] text-[rgba(160,125,55,0.5)]">✦ ✦ ✦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.25)] to-transparent" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[rgba(232,224,208,0.92)]">Panel Docente</h1>
        <p className="text-sm font-serif text-[rgba(160,125,55,0.55)]">
          Vista general del estado académico gamificado
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AnimatedStatCard label="Cursos Activos" value={courses.length} index={0} />
        <AnimatedStatCard label="Total Alumnos" value={totalStudents} index={1} />
        <AnimatedStatCard
          label="Alumnos en Riesgo"
          value={atRisk.length}
          danger={atRisk.length > 0}
          index={2}
        />
        <LastSyncCard lastSync={lastSync} />
      </div>

      {/* At-risk students */}
      <AtRiskTable atRisk={atRisk} courses={courses} />

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.2)] to-transparent" />

      {/* Clases Formativas */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-lg font-semibold text-[rgba(232,224,208,0.88)]">Clases Formativas</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[rgba(160,125,55,0.22)] to-transparent" />
        </div>
        <p className="mb-5 text-xs font-serif text-[rgba(160,125,55,0.5)]">
          Las clases publicadas son visibles para que los alumnos elijan. Son una capa simbólica —
          no afectan la nota institucional.
        </p>
        <FormativeClassEditor initialClasses={formativeClasses} />
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.2)] to-transparent" />

      {/* Talentos */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-lg font-semibold text-[rgba(232,224,208,0.88)]">Talentos</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[rgba(160,125,55,0.22)] to-transparent" />
        </div>
        <p className="mb-5 text-xs font-serif text-[rgba(160,125,55,0.5)]">
          Los talentos activos pueden ser otorgados por el sistema (según condiciones) o manualmente
          desde el Panel de Acciones. El mismo talento se otorga una sola vez por alumno.
        </p>
        <TalentConfigEditor initialTalents={talentConfig} />
      </section>
    </TeacherAnimatedWrapper>
  );
}

function LastSyncCard({ lastSync }: { lastSync: string | null }) {
  return (
    <div className="chronicle-stone relative p-4">
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
      <p className="relative z-10 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.6)]">Última sincronización</p>
      <p className="relative z-10 mt-1 font-serif text-sm text-[rgba(232,224,208,0.85)]">
        {lastSync
          ? new Date(lastSync).toLocaleString("es-AR", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "Sin datos aún"}
      </p>
    </div>
  );
}
