import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllStrikesForCourse } from "@/lib/supabase/game";
import { getCourseById, getCourseworkConfig } from "@/lib/supabase/courses";
import { getProfile } from "@/lib/supabase/profiles";
import { getXpConfig } from "@/lib/supabase/config";
import PrintButton from "./PrintButton";

const REASON_LABELS: Record<string, string> = {
  no_submission: "No entregado",
  late_submission: "Entrega tardía",
  missing_materials: "No trajo materiales",
};

export default async function StudentStrikesReport({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; courseId?: string; bimestre?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const { email, courseId, bimestre } = await searchParams;
  if (!email || !courseId || !bimestre) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-[#9aab8a]">Parámetros inválidos. Cerrá esta pestaña.</p>
      </div>
    );
  }

  const [course, profile, allStrikes, courseworkConfig, xpConfig] = await Promise.all([
    getCourseById(courseId),
    getProfile(email),
    getAllStrikesForCourse(courseId, bimestre),
    getCourseworkConfig(courseId),
    getXpConfig(courseId),
  ]);

  const cwNameMap = new Map(courseworkConfig.map((c) => [c.classroom_coursework_id, c.name]));
  const cwTipoMap = new Map(courseworkConfig.map((c) => [c.classroom_coursework_id, c.tipo]));
  const tipoLabelMap = new Map(xpConfig.map((x) => [x.tipo, x.label]));

  const activeStrikes = allStrikes.filter(
    (s) => s.student_email === email && s.active
  );

  const displayName = profile?.display_name ?? email;
  const generatedAt = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <style>{`
        @media print {
          aside, header, footer { display: none !important; }
          main { padding: 0 !important; }
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>

      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="no-print flex items-center gap-3">
          <PrintButton />
        </div>

        <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-6 print:border-gray-300 print:bg-white print:text-black">
          <h1 className="font-serif text-xl text-[#f5f0e8] print:text-black">
            Informe de Strikes — {displayName}
          </h1>
          <p className="mt-1 text-sm text-[#9aab8a] print:text-gray-600">
            {course?.name ?? courseId} · {bimestre}
          </p>
          <p className="mt-0.5 text-xs text-[#9aab8a] print:text-gray-500">
            Email: {email}
          </p>

          {activeStrikes.length === 0 ? (
            <p className="mt-6 text-sm italic text-[#9aab8a] print:text-gray-500">
              Sin strikes activos en {bimestre}.
            </p>
          ) : (
            <div className="mt-5 overflow-hidden rounded-lg border border-[#1e3320] print:border-gray-300">
              <table className="w-full text-sm">
                <thead className="bg-[#0d1a0f] text-left text-xs text-[#9aab8a] print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Motivo</th>
                    <th className="px-3 py-2">Tarea</th>
                    <th className="px-3 py-2">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3320] print:divide-gray-200">
                  {activeStrikes.map((s, i) => {
                    const taskName = s.classroom_coursework_id
                      ? (cwNameMap.get(s.classroom_coursework_id) ?? null)
                      : null;
                    const tipo = s.classroom_coursework_id
                      ? (cwTipoMap.get(s.classroom_coursework_id) ?? null)
                      : null;
                    const tipoLabel = tipo ? (tipoLabelMap.get(tipo) ?? tipo) : null;

                    return (
                      <tr key={s.id}>
                        <td className="px-3 py-2 text-[#f5f0e8] print:text-black">{i + 1}</td>
                        <td className="px-3 py-2 text-[#f5f0e8] print:text-black">
                          {REASON_LABELS[s.reason] ?? s.reason}
                        </td>
                        <td className="px-3 py-2 text-xs text-[#9aab8a] print:text-gray-600">
                          <div className="flex items-center gap-2">
                            <span>{taskName ?? s.classroom_coursework_id ?? "—"}</span>
                            {tipoLabel && (
                              <span className="rounded bg-[#1e3320] px-1.5 py-0.5 text-[10px] font-medium text-[#c9a227] print:bg-gray-100 print:text-gray-700">
                                {tipoLabel}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-[#9aab8a] print:text-gray-600">
                          {new Date(s.created_at).toLocaleDateString("es-AR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-6 text-xs text-[#9aab8a] print:text-gray-400">
            Generado el {generatedAt} · LevelUp — Visor Académico
          </p>
        </div>
      </div>
    </>
  );
}
