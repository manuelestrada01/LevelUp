import { auth } from "@/auth";
import { getCoursesByTeacher } from "@/lib/supabase/courses";
import { getAllStudentGameStates } from "@/lib/supabase/game";
import Link from "next/link";
import { AlertTriangle, Users, BookOpen, RefreshCw } from "lucide-react";
import SyncStatus from "@/docente/components/SyncStatus";

export default async function TeacherDashboardPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const courses = await getCoursesByTeacher(email);

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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">Panel Docente</h1>
        <p className="mt-1 text-sm text-[#9aab8a]">
          Vista general del estado académico gamificado
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Cursos Activos" value={courses.length} />
        <StatCard label="Total Alumnos" value={totalStudents} />
        <StatCard
          label="Alumnos en Riesgo"
          value={atRisk.length}
          danger={atRisk.length > 0}
        />
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
      </div>

      {/* Courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-[#f5f0e8]">Cursos Activos</h2>
          <Link
            href="/teacher/courses"
            className="text-sm text-[#c9a227] hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        {courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#1e3320] p-8 text-center">
            <BookOpen size={32} className="mx-auto mb-3 text-[#9aab8a]" />
            <p className="text-[#9aab8a]">No tenés cursos registrados.</p>
            <Link
              href="/teacher/courses"
              className="mt-3 inline-block rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-medium text-[#0d1a0f]"
            >
              Agregar curso
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/teacher/courses/${course.id}`}
                className="group rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5 transition-colors hover:border-[#c9a227]/40"
              >
                <p className="font-serif text-base text-[#f5f0e8] group-hover:text-[#c9a227]">
                  {course.name}
                </p>
                {course.section && (
                  <p className="mt-0.5 text-xs text-[#9aab8a]">{course.section}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-[#9aab8a]">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {allStates.filter((s) => s.course_id === course.id).length} alumnos
                  </span>
                  <span className="rounded bg-[#0d1a0f] px-2 py-0.5 text-[#c9a227]">
                    {course.bimestre_activo}
                  </span>
                  <span>{course.year}° año</span>
                </div>
                <SyncStatus courseId={course.id} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* At-risk students */}
      {atRisk.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-lg text-[#f5f0e8]">
            <span className="mr-2 inline-flex items-center gap-1 text-[#c0392b]">
              <AlertTriangle size={16} />
            </span>
            Alumnos en Riesgo
          </h2>
          <div className="overflow-hidden rounded-xl border border-[#1e3320]">
            <table className="w-full text-sm">
              <thead className="bg-[#1a2e1c] text-left text-xs text-[#9aab8a]">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Bimestre</th>
                  <th className="px-4 py-3">XP</th>
                  <th className="px-4 py-3">Strikes</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3320] bg-[#0d1a0f]">
                {atRisk.map((s) => {
                  const course = courses.find((c) => c.id === s.course_id);
                  return (
                    <tr key={s.id} className="hover:bg-[#1a2e1c]">
                      <td className="px-4 py-3 text-[#f5f0e8]">{s.student_email}</td>
                      <td className="px-4 py-3 text-[#9aab8a]">{s.bimestre}</td>
                      <td className="px-4 py-3 font-medium text-[#c9a227]">{s.xp_total}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span
                              key={i}
                              className={`flex h-5 w-5 items-center justify-center rounded text-xs font-bold ${
                                i < s.strikes_active
                                  ? "bg-[#c0392b]/20 text-[#c0392b]"
                                  : "bg-[#1e3320] text-[#1e3320]"
                              }`}
                            >
                              ✕
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${
                            s.blocked
                              ? "bg-[#c0392b]/20 text-[#c0392b]"
                              : "bg-yellow-900/30 text-yellow-400"
                          }`}
                        >
                          {s.blocked ? "BLOQUEADO" : "EN RIESGO"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {course && (
                          <Link
                            href={`/teacher/courses/${course.id}`}
                            className="text-xs text-[#c9a227] hover:underline"
                          >
                            Ver curso
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
      <p className="text-xs text-[#9aab8a]">{label}</p>
      <p
        className={`mt-1 font-serif text-2xl font-bold ${
          danger ? "text-[#c0392b]" : "text-[#c9a227]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
