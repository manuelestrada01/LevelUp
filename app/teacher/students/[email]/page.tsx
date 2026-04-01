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
          className="flex items-center gap-1 text-sm text-[#9aab8a] hover:text-[#f5f0e8]"
        >
          <ArrowLeft size={14} />
          {primaryCourse.name}
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">{displayName}</h1>
        {displayName !== studentEmail && (
          <p className="text-xs text-[#9aab8a]">{studentEmail}</p>
        )}
        <p className="mt-0.5 text-sm text-[#9aab8a]">
          {levelTitle}
          {levelRole && <span className="text-[#9aab8a]"> · {levelRole}</span>}
          {" · "}
          {primaryState.bimestre}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
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
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-[#9aab8a]">
          <span>
            {levelTitle}
            {levelRole && <span className="ml-1 text-[#c9a227]/70">— {levelRole}</span>}
          </span>
          <span>Nivel {primaryState.level + 1}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#0d1a0f]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8fbc8f] to-[#c9a227]"
            style={{
              width: `${Math.min(
                100,
                ((primaryState.xp_total - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100
              )}%`,
            }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-[#9aab8a]">
          {primaryState.xp_total} / {xpNextLevel} XP
        </p>
      </div>

      {/* Strikes Activos */}
      <div className="rounded-xl border border-[#c0392b]/30 bg-[#1a2e1c] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-base text-[#f5f0e8]">Strikes Activos</h2>
          <ForceStrikeButton
            courseId={primaryState.course_id}
            studentEmail={studentEmail}
          />
        </div>
        {activeStrikes.length === 0 ? (
          <p className="text-sm text-[#9aab8a]">Sin strikes activos.</p>
        ) : (
          <div className="space-y-2">
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
                  className="flex items-center justify-between rounded-lg bg-[#0d1a0f] px-3 py-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm text-[#f5f0e8]">
                      {REASON_LABELS[strike.reason] ?? strike.reason}
                    </p>
                    {taskName && (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-[#c9a227]/80">{taskName}</p>
                        {delivery?.tipo && (
                          <span className="rounded bg-[#1e3320] px-1.5 py-0.5 text-[10px] font-medium text-[#c9a227]">
                            {delivery.tipo}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-[#9aab8a]">
                      {delivery?.due_at
                        ? `Vencimiento: ${new Date(dateToShow).toLocaleDateString("es-AR")}`
                        : new Date(dateToShow).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#c0392b]/20 px-2 py-0.5 text-xs text-[#c0392b]">
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
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
        <h2 className="mb-3 font-serif text-base text-[#f5f0e8]">Talentos</h2>
        <TalentGranter
          courseId={primaryState.course_id}
          studentEmail={studentEmail}
          grantedTalentIds={[...grantedTalentIds]}
          allTalents={ALL_TALENTS}
        />
      </div>

      {/* Misiones de Gremio y Encargos Semanales */}
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
        <h2 className="mb-3 font-serif text-base text-[#f5f0e8]">
          Misiones de Gremio y Encargos Semanales
        </h2>
        {deliveries.length === 0 ? (
          <p className="text-sm text-[#9aab8a]">Sin entregas registradas aún.</p>
        ) : (
          <div className="space-y-1">
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
                  className="flex items-center justify-between rounded-lg bg-[#0d1a0f] px-3 py-2 text-sm"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#1e3320] px-2 py-0.5 text-xs font-medium text-[#c9a227]">
                        {d.tipo}
                      </span>
                      {taskName && (
                        <span className="text-xs text-[#f5f0e8]">{taskName}</span>
                      )}
                      <span
                        className={`text-xs ${
                          d.status === "OK"
                            ? "text-[#8fbc8f]"
                            : d.status === "LATE"
                            ? "text-yellow-400"
                            : d.status === "PENDING"
                            ? "text-[#9aab8a]"
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
                        <span className="text-xs text-[#c9a227]">+temprana</span>
                      )}
                    </div>
                    {submittedDate && (
                      <span className="text-xs text-[#9aab8a]">{submittedDate}</span>
                    )}
                  </div>
                  <span className="text-xs text-[#9aab8a]">
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
        <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
          <h2 className="mb-3 font-serif text-base text-[#f5f0e8]">
            Historial de Clases Formativas
          </h2>
          <div className="flex flex-wrap gap-2">
            {classHistory.map((h) => (
              <div
                key={h.id}
                className="rounded-lg border border-[#1e3320] bg-[#0d1a0f] px-3 py-2"
              >
                <p className="text-sm text-[#f5f0e8]">
                  {h.formative_classes?.title ?? h.class_slug}
                </p>
                <p className="text-xs text-[#9aab8a]">
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
    <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
      <p className="text-xs text-[#9aab8a]">{label}</p>
      <p
        className={`mt-1 font-serif text-xl font-bold ${
          danger ? "text-[#c0392b]" : amber ? "text-[#c9a227]" : "text-[#f5f0e8]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
