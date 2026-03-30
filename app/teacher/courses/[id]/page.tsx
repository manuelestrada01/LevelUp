import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getCourseById, isTeacherOfCourse } from "@/lib/supabase/courses";
import { getAllStudentGameStates, getAllStrikesForCourse } from "@/lib/supabase/game";
import { getXpConfig, getBimestreConfig } from "@/lib/supabase/config";
import { getClassHistory } from "@/lib/supabase/classes";
import StudentRow from "@/docente/components/StudentRow";
import ResumenAcademico from "@/docente/components/ResumenAcademico";
import ConfigAdminPanel from "@/docente/components/ConfigAdminPanel";
import CourseTabNav from "@/docente/components/CourseTabNav";
import { Suspense } from "react";
import SyncStatus from "@/docente/components/SyncStatus";
import StudentActionsPanel from "@/docente/components/StudentActionsPanel";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const { id } = await params;
  const { tab = "panel" } = await searchParams;

  const allowed = await isTeacherOfCourse(id, email);
  if (!allowed) notFound();

  const course = await getCourseById(id);
  if (!course) notFound();

  const [gameStates, allStrikes] = await Promise.all([
    getAllStudentGameStates(id, course.bimestre_activo),
    getAllStrikesForCourse(id, course.bimestre_activo),
  ]);

  const strikesByStudent = new Map<string, typeof allStrikes>();
  for (const strike of allStrikes) {
    if (!strikesByStudent.has(strike.student_email)) {
      strikesByStudent.set(strike.student_email, []);
    }
    strikesByStudent.get(strike.student_email)!.push(strike);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/teacher/courses"
          className="flex items-center gap-1 text-sm text-[#9aab8a] hover:text-[#f5f0e8]"
        >
          <ArrowLeft size={14} />
          Cursos
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#f5f0e8]">{course.name}</h1>
          {course.section && (
            <p className="mt-0.5 text-sm text-[#9aab8a]">
              {course.section} · {course.year}° año · {course.bimestre_activo}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SyncStatus courseId={id} />
          <Link
            href={`/teacher/courses/${id}/setup`}
            className="flex items-center gap-1 rounded-lg border border-[#1e3320] px-3 py-2 text-xs text-[#9aab8a] hover:border-[#c9a227]/40 hover:text-[#c9a227]"
          >
            <Settings size={12} />
            Configurar tareas
          </Link>
        </div>
      </div>

      <Suspense fallback={<div className="h-10 border-b border-[#1e3320]" />}>
        <CourseTabNav courseId={id} />
      </Suspense>

      {tab === "resumen" && (
        <ResumenAcademico gameStates={gameStates} bimestre={course.bimestre_activo} />
      )}

      {tab === "panel" && (
        <>
          {gameStates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#1e3320] p-12 text-center">
              <p className="text-[#9aab8a]">
                No hay datos de alumnos aún. Sincronizá el curso para cargar las entregas.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#1e3320]">
              <table className="w-full text-sm">
                <thead className="bg-[#1a2e1c] text-left text-xs text-[#9aab8a]">
                  <tr>
                    <th className="px-4 py-3">Alumno</th>
                    <th className="px-4 py-3">Nivel</th>
                    <th className="px-4 py-3">XP</th>
                    <th className="px-4 py-3">Strikes</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3320] bg-[#0d1a0f]">
                  {gameStates.map((state) => (
                    <StudentRow
                      key={state.id}
                      state={state}
                      courseId={id}
                      strikes={strikesByStudent.get(state.student_email) ?? []}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === "alumnos" && (
        <AlumnosTab
          gameStates={gameStates}
          courseId={id}
          bimestre={course.bimestre_activo}
        />
      )}

      {tab === "config" && <ConfigTab courseId={id} />}
    </div>
  );
}

async function AlumnosTab({
  gameStates,
  courseId,
  bimestre,
}: {
  gameStates: Awaited<ReturnType<typeof getAllStudentGameStates>>;
  courseId: string;
  bimestre: string;
}) {
  if (gameStates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#1e3320] p-12 text-center">
        <p className="text-[#9aab8a]">No hay alumnos sincronizados aún.</p>
      </div>
    );
  }

  const histories = await Promise.all(
    gameStates.map((s) => getClassHistory(s.student_email))
  );

  return (
    <div className="flex flex-col gap-4">
      {gameStates.map((state, i) => {
        const history = histories[i];
        return (
          <div
            key={state.student_email}
            className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#f5f0e8]">{state.student_email}</p>
                <p className="text-xs text-[#9aab8a]">
                  Nivel {state.level} · {state.xp_total} XP · {state.strikes_active} strike
                  {state.strikes_active !== 1 ? "s" : ""}
                </p>
              </div>
              <StudentActionsPanel
                courseId={courseId}
                bimestre={bimestre}
                studentEmail={state.student_email}
              />
            </div>
            {history.length > 0 && (
              <div className="mt-3 border-t border-[#1e3320] pt-3">
                <p className="mb-1.5 text-xs text-[#9aab8a]">Historial de Clases Formativas</p>
                <div className="flex flex-wrap gap-2">
                  {history.map((h) => (
                    <span
                      key={h.id}
                      className="rounded border border-[#1e3320] px-2 py-0.5 text-xs text-[#9aab8a]"
                    >
                      {h.formative_classes?.title ?? h.class_slug} ·{" "}
                      {new Date(h.chosen_at).toLocaleDateString("es-AR")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

async function ConfigTab({ courseId }: { courseId: string }) {
  const [xpConfig, bimestreConfig] = await Promise.all([
    getXpConfig(courseId),
    getBimestreConfig(courseId),
  ]);
  return (
    <ConfigAdminPanel courseId={courseId} xpConfig={xpConfig} bimestreConfig={bimestreConfig} />
  );
}
