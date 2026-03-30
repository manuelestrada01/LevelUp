import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getCoursesByTeacher } from "@/lib/supabase/courses";
import { getStudentGameStateByEmail, getDeliveriesByStudentEmail, getActiveStrikes } from "@/lib/supabase/game";
import { getTalentsForStudent, getDistinctionsForStudent, getExceptionsForStudent } from "@/lib/supabase/teacher";
import { getLevelRange, XP_THRESHOLDS } from "@/xp/engine";
import { ALL_TALENTS } from "@/talentos/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TalentGranter from "@/docente/components/TalentGranter";

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

  const [gameStates, deliveries] = await Promise.all([
    getStudentGameStateByEmail(studentEmail),
    getDeliveriesByStudentEmail(studentEmail, 20),
  ]);

  const ownedGameStates = gameStates.filter((s) =>
    teacherCourses.some((c) => c.id === s.course_id)
  );

  if (ownedGameStates.length === 0) notFound();

  const primaryState = ownedGameStates[0];
  const primaryCourse = teacherCourses.find((c) => c.id === primaryState.course_id)!;

  const [activeStrikes, talentGrants, distinctions, exceptions] = await Promise.all([
    getActiveStrikes(primaryState.course_id, studentEmail, primaryState.bimestre),
    getTalentsForStudent(primaryState.course_id, studentEmail),
    getDistinctionsForStudent(primaryState.course_id, studentEmail),
    getExceptionsForStudent(primaryState.course_id, studentEmail),
  ]);

  const grantedTalentIds = new Set(talentGrants.map((t) => t.talent_id));
  const levelRange = getLevelRange(primaryState.level);
  const xpCurrentLevel = XP_THRESHOLDS[primaryState.level - 1] ?? 0;
  const xpNextLevel = XP_THRESHOLDS[primaryState.level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/teacher/courses/${primaryState.course_id}`}
          className="flex items-center gap-1 text-sm text-[#9aab8a] hover:text-[#f5f0e8]"
        >
          <ArrowLeft size={14} />
          {primaryCourse.name}
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">{studentEmail}</h1>
        <p className="mt-0.5 text-sm text-[#9aab8a]">
          Nivel {primaryState.level} · {levelRange.title} · {primaryState.bimestre}
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

      {/* XP progress */}
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-[#9aab8a]">
          <span>NIVEL {primaryState.level}</span>
          <span>NIVEL {primaryState.level + 1}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#0d1a0f]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8fbc8f] to-[#c9a227]"
            style={{
              width: `${Math.min(100, ((primaryState.xp_total - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100)}%`,
            }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-[#9aab8a]">
          {primaryState.xp_total} / {xpNextLevel} XP
        </p>
      </div>

      {/* Strikes */}
      {activeStrikes.length > 0 && (
        <div className="rounded-xl border border-[#c0392b]/30 bg-[#1a2e1c] p-4">
          <h2 className="mb-3 font-serif text-base text-[#f5f0e8]">Strikes Activos</h2>
          <div className="space-y-2">
            {activeStrikes.map((strike) => (
              <div
                key={strike.id}
                className="flex items-center justify-between rounded-lg bg-[#0d1a0f] px-3 py-2"
              >
                <div>
                  <p className="text-sm text-[#f5f0e8]">{strike.reason.replace("_", " ")}</p>
                  <p className="text-xs text-[#9aab8a]">
                    {new Date(strike.created_at).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <span className="rounded bg-[#c0392b]/20 px-2 py-0.5 text-xs text-[#c0392b]">
                  Activo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Talents */}
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
        <h2 className="mb-3 font-serif text-base text-[#f5f0e8]">Talentos</h2>
        <TalentGranter
          courseId={primaryState.course_id}
          studentEmail={studentEmail}
          grantedTalentIds={[...grantedTalentIds]}
          allTalents={ALL_TALENTS}
        />
      </div>

      {/* Recent deliveries */}
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
        <h2 className="mb-3 font-serif text-base text-[#f5f0e8]">Entregas Recientes</h2>
        {deliveries.length === 0 ? (
          <p className="text-sm text-[#9aab8a]">Sin entregas registradas aún.</p>
        ) : (
          <div className="space-y-1">
            {deliveries.slice(0, 10).map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-lg bg-[#0d1a0f] px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#1e3320] px-2 py-0.5 text-xs font-medium text-[#c9a227]">
                    {d.tipo}
                  </span>
                  <span
                    className={`text-xs ${
                      d.status === "OK"
                        ? "text-[#8fbc8f]"
                        : d.status === "LATE"
                        ? "text-yellow-400"
                        : "text-[#c0392b]"
                    }`}
                  >
                    {d.status}
                  </span>
                  {d.is_early && (
                    <span className="text-xs text-[#c9a227]">+temprana</span>
                  )}
                </div>
                <span className="text-xs text-[#9aab8a]">
                  +{d.xp_base + d.xp_bonus} XP
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exception log */}
      {exceptions.length > 0 && (
        <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
          <h2 className="mb-3 font-serif text-base text-[#f5f0e8]">Historial de Excepciones</h2>
          <div className="space-y-1">
            {exceptions.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between rounded-lg bg-[#0d1a0f] px-3 py-2 text-xs"
              >
                <span className="text-[#9aab8a]">{ex.type.replace("_", " ")}</span>
                {ex.notes && <span className="text-[#f5f0e8]">{ex.notes}</span>}
                <span className="text-[#9aab8a]">
                  {new Date(ex.created_at).toLocaleDateString("es-AR")}
                </span>
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
