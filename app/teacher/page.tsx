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
      <div>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">Panel Docente</h1>
        <p className="mt-1 text-sm text-[#9aab8a]">
          Vista general del estado académico gamificado
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
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

      <div className="border-t border-[#1e3320]" />

      {/* Clases Formativas */}
      <section>
        <h2 className="mb-1 font-serif text-xl text-[#f5f0e8]">Clases Formativas</h2>
        <p className="mb-5 text-xs text-[#9aab8a]">
          Las clases publicadas son visibles para que los alumnos elijan. Son una capa simbólica —
          no afectan la nota institucional.
        </p>
        <FormativeClassEditor initialClasses={formativeClasses} />
      </section>

      <div className="border-t border-[#1e3320]" />

      {/* Talentos */}
      <section>
        <h2 className="mb-1 font-serif text-xl text-[#f5f0e8]">Talentos</h2>
        <p className="mb-5 text-xs text-[#9aab8a]">
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
    <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
      <p className="text-xs text-[#9aab8a]">Última sincronización</p>
      <p className="mt-1 text-sm text-[#f5f0e8]">
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
