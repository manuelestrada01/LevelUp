import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getCoursesByTeacher, getCourseworkConfig } from "@/lib/supabase/courses";
import {
  getStudentGameStateByEmail,
  getDeliveriesForStudent,
  getActiveStrikes,
} from "@/lib/supabase/game";
import {
  getTalentsForStudent,
  getDistinctionsForStudent,
  getExceptionsForStudent,
} from "@/lib/supabase/teacher";
import { getLevelConfig } from "@/lib/supabase/config";
import { getProfile } from "@/lib/supabase/profiles";
import { getClassHistory } from "@/lib/supabase/classes";
import { XP_THRESHOLDS } from "@/xp/engine";
import { ALL_TALENTS } from "@/talentos/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TalentGranter from "@/docente/components/TalentGranter";
import AnnulStrikeButton from "@/docente/components/AnnulStrikeButton";
import ForceStrikeButton from "@/docente/components/ForceStrikeButton";
import DestacadosGremioEditor from "@/docente/components/DestacadosGremioEditor";

const REASON_LABELS: Record<string, string> = {
  no_submission: "No entregado",
  late_submission: "Entrega tardía",
  missing_materials: "No trajo materiales",
};


export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const session = await auth();
  const teacherEmail = session?.user?.email ?? "";
  const { email } = await params;
  const studentEmail = decodeURIComponent(email);

  const teacherCourses = await getCoursesByTeacher(teacherEmail);
  if (teacherCourses.length === 0) notFound();

  const gameStates = await getStudentGameStateByEmail(studentEmail);
  const ownedGameStates = gameStates.filter((s) =>
    teacherCourses.some((c) => c.id === s.course_id)
  );
  if (ownedGameStates.length === 0) notFound();

  const primaryState = ownedGameStates[0];
  const primaryCourse = teacherCourses.find((c) => c.id === primaryState.course_id)!;

  const [
    activeStrikes,
    talentGrants,
    distinctions,
    exceptions,
    levelConfig,
    courseworkConfig,
    deliveries,
    classHistory,
    profile,
  ] = await Promise.all([
    getActiveStrikes(primaryState.course_id, studentEmail, primaryState.bimestre),
    getTalentsForStudent(primaryState.course_id, studentEmail),
    getDistinctionsForStudent(primaryState.course_id, studentEmail),
    getExceptionsForStudent(primaryState.course_id, studentEmail),
    getLevelConfig(),
    getCourseworkConfig(primaryState.course_id),
    getDeliveriesForStudent(primaryState.course_id, studentEmail, primaryState.bimestre),
    getClassHistory(studentEmail),
    getProfile(studentEmail),
  ]);

  const displayName = profile?.display_name ?? studentEmail;
  const grantedTalentIds = new Set(talentGrants.map((t) => t.talent_id));

  // Level info: prefer Supabase config, fall back to level number
  const levelEntry = levelConfig.find((l) => l.nivel === primaryState.level);
  const levelTitle = levelEntry?.title ?? `Nivel ${primaryState.level}`;
  const levelRole = levelEntry?.role ?? null;

  // XP bar
  const xpCurrentLevel = XP_THRESHOLDS[primaryState.level - 1] ?? 0;
  const xpNextLevel =
    XP_THRESHOLDS[primaryState.level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];

  // Lookup maps for §8 bug fix: task name + due date from deliveries
  const cwNameMap = new Map(courseworkConfig.map((c) => [c.classroom_coursework_id, c.name]));
  const deliveryMap = new Map(deliveries.map((d) => [d.classroom_coursework_id, d]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/teacher/courses/${primaryState.course_id}?tab=alumnos`}
          className="flex items-center gap-1 text-[11px] font-serif uppercase tracking-[0.15em] text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.85)] transition-colors"
        >
          <ArrowLeft size={12} />
          {primaryCourse.name}
        </Link>
        <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.15)] to-transparent" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.45)] to-transparent" />
          <span className="text-[11px] font-serif uppercase tracking-[0.38em] text-[rgba(160,125,55,0.5)]">✦ ✦ ✦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.25)] to-transparent" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[rgba(232,224,208,0.92)]">{displayName}</h1>
        {displayName !== studentEmail && (
          <p className="text-xs font-serif text-[rgba(160,125,55,0.5)]">{studentEmail}</p>
        )}
        <p className="text-sm font-serif text-[rgba(160,125,55,0.55)]">
          {levelTitle}
          {levelRole && <span className="text-[rgba(160,125,55,0.45)]"> · {levelRole}</span>}
          {" · "}
          {primaryState.bimestre}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="XP Total" value={String(primaryState.xp_total)} amber />
        <StatCard label="Nivel" value={String(primaryState.level)} />
        <StatCard
          label="Strikes Activos"
          value={String(primaryState.strikes_active)}
          danger={primaryState.strikes_active >= 2}
        />
        <StatCard
          label="Estado"
          value={primaryState.blocked ? "BLOQUEADO" : "ACTIVO"}
          danger={primaryState.blocked}
        />
      </div>

      {/* XP progress bar */}
      <div className="chronicle-stone relative p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
        <div className="relative z-10 mb-2 flex items-center justify-between text-[11px] font-serif">
          <span className="text-[rgba(160,125,55,0.65)]">
            {levelTitle}
            {levelRole && <span className="ml-1 text-[rgba(200,168,75,0.55)]">— {levelRole}</span>}
          </span>
          <span className="text-[rgba(160,125,55,0.5)]">Nivel {primaryState.level + 1}</span>
        </div>
        <div className="relative z-10 h-1.5 overflow-hidden bg-[rgba(160,125,55,0.1)]">
          <div
            className="h-full bg-gradient-to-r from-[rgba(143,188,143,0.7)] to-[rgba(200,168,75,0.8)]"
            style={{
              width: `${Math.min(
                100,
                ((primaryState.xp_total - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100
              )}%`,
            }}
          />
        </div>
        <p className="relative z-10 mt-1 text-right text-[11px] font-serif text-[rgba(160,125,55,0.55)]">
          {primaryState.xp_total} / {xpNextLevel} XP
        </p>
      </div>

      {/* Strikes Activos */}
      <div className="chronicle-stone relative p-4" style={{ borderColor: activeStrikes.length > 0 ? "rgba(192,57,43,0.35)" : undefined }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.03)_0%,transparent_60%)]" />
        <div className="relative z-10 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-base font-semibold text-[rgba(232,224,208,0.88)]">Strikes Activos</h2>
            <div className="h-px w-16 bg-gradient-to-r from-[rgba(160,125,55,0.2)] to-transparent" />
          </div>
          <ForceStrikeButton
            courseId={primaryState.course_id}
            studentEmail={studentEmail}
          />
        </div>
        {activeStrikes.length === 0 ? (
          <p className="relative z-10 text-sm font-serif text-[rgba(160,125,55,0.45)]">Sin strikes activos.</p>
        ) : (
          <div className="relative z-10 space-y-2">
            {activeStrikes.map((strike) => {
              const taskName = strike.classroom_coursework_id
                ? (cwNameMap.get(strike.classroom_coursework_id) ?? null)
                : null;
              const delivery = strike.classroom_coursework_id
                ? deliveryMap.get(strike.classroom_coursework_id)
                : null;
              const dateToShow = delivery?.due_at ?? strike.created_at;

              return (
                <div
                  key={strike.id}
                  className="flex items-center justify-between border border-[rgba(192,57,43,0.2)] bg-[rgba(192,57,43,0.04)] px-3 py-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-serif text-[rgba(232,224,208,0.88)]">
                      {REASON_LABELS[strike.reason] ?? strike.reason}
                    </p>
                    {taskName && (
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-serif text-[rgba(200,168,75,0.65)]">{taskName}</p>
                        {delivery?.tipo && (
                          <span className="border border-[rgba(200,168,75,0.25)] bg-[rgba(200,168,75,0.06)] px-1.5 py-0.5 text-[10px] font-serif uppercase tracking-widest text-[rgba(200,168,75,0.7)]">
                            {delivery.tipo}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs font-serif text-[rgba(160,125,55,0.5)]">
                      {delivery?.due_at
                        ? `Vencimiento: ${new Date(dateToShow).toLocaleDateString("es-AR")}`
                        : new Date(dateToShow).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="border border-[rgba(192,57,43,0.4)] bg-[rgba(192,57,43,0.1)] px-2 py-0.5 text-[10px] font-serif uppercase tracking-widest text-[#c0392b]">
                      Activo
                    </span>
                    <AnnulStrikeButton
                      strikeId={strike.id}
                      courseId={primaryState.course_id}
                      studentEmail={studentEmail}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Talentos */}
      <div className="chronicle-stone relative p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.03)_0%,transparent_60%)]" />
        <div className="relative z-10 flex items-center gap-3 mb-3">
          <h2 className="font-serif text-base font-semibold text-[rgba(232,224,208,0.88)]">Talentos</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.22)] to-transparent" />
        </div>
        <TalentGranter
          courseId={primaryState.course_id}
          studentEmail={studentEmail}
          grantedTalentIds={[...grantedTalentIds]}
          allTalents={ALL_TALENTS}
        />
      </div>

      {/* Misiones de Gremio y Encargos Semanales */}
      <div className="chronicle-stone relative p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.03)_0%,transparent_60%)]" />
        <div className="relative z-10 flex items-center gap-3 mb-3">
          <h2 className="font-serif text-base font-semibold text-[rgba(232,224,208,0.88)]">
            Misiones de Gremio y Encargos Semanales
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.22)] to-transparent" />
        </div>
        {deliveries.length === 0 ? (
          <p className="relative z-10 text-sm font-serif text-[rgba(160,125,55,0.45)]">Sin entregas registradas aún.</p>
        ) : (
          <div className="relative z-10 space-y-1">
            {deliveries.slice(0, 15).map((d) => {
              const taskName = cwNameMap.get(d.classroom_coursework_id);
              const submittedDate = d.submitted_at
                ? new Date(d.submitted_at).toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                : null;

              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between border-b border-[rgba(160,125,55,0.1)] px-3 py-2 last:border-b-0 text-sm hover:bg-[rgba(160,125,55,0.03)] transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="border border-[rgba(200,168,75,0.25)] bg-[rgba(200,168,75,0.06)] px-1.5 py-0.5 text-[10px] font-serif uppercase tracking-widest text-[rgba(200,168,75,0.7)]">
                        {d.tipo}
                      </span>
                      {taskName && (
                        <span className="text-xs font-serif text-[rgba(232,224,208,0.8)]">{taskName}</span>
                      )}
                      <span
                        className={`text-[10px] font-serif uppercase tracking-widest ${
                          d.status === "OK"
                            ? "text-[rgba(143,188,143,0.8)]"
                            : d.status === "LATE"
                            ? "text-yellow-400"
                            : d.status === "PENDING"
                            ? "text-[rgba(160,125,55,0.5)]"
                            : "text-[#c0392b]"
                        }`}
                      >
                        {d.status === "OK"
                          ? "Entregado"
                          : d.status === "LATE"
                          ? "Tardío"
                          : d.status === "PENDING"
                          ? "Pendiente"
                          : "No entregado"}
                      </span>
                      {d.is_early && (
                        <span className="text-[10px] font-serif text-[rgba(200,168,75,0.65)]">+temprana</span>
                      )}
                    </div>
                    {submittedDate && (
                      <span className="text-xs font-serif text-[rgba(160,125,55,0.45)]">{submittedDate}</span>
                    )}
                  </div>
                  <span className="text-xs font-serif text-[rgba(200,168,75,0.6)]">
                    +{d.xp_base + d.xp_bonus} XP
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Destacados del Gremio */}
      <DestacadosGremioEditor studentEmail={studentEmail} exceptions={exceptions} />

      {/* Historial de Clases Formativas */}
      {classHistory.length > 0 && (
        <div className="chronicle-stone relative p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.03)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-3">
            <h2 className="font-serif text-base font-semibold text-[rgba(232,224,208,0.88)]">
              Historial de Clases Formativas
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.22)] to-transparent" />
          </div>
          <div className="relative z-10 flex flex-wrap gap-2">
            {classHistory.map((h) => (
              <div
                key={h.id}
                className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.05)] px-3 py-2"
              >
                <p className="text-sm font-serif text-[rgba(232,224,208,0.85)]">
                  {h.formative_classes?.title ?? h.class_slug}
                </p>
                <p className="text-xs font-serif text-[rgba(160,125,55,0.5)]">
                  {new Date(h.chosen_at).toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  amber,
  danger,
}: {
  label: string;
  value: string;
  amber?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="chronicle-stone relative p-4">
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none z-10">◆</span>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
      <p className="relative z-10 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.6)]">{label}</p>
      <p
        className={`relative z-10 mt-1 font-serif text-xl font-bold ${
          danger ? "text-[#c0392b]" : amber ? "text-[#c9a227]" : "text-[rgba(232,224,208,0.9)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
