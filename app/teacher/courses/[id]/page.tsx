import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getCourseById, isTeacherOfCourse } from "@/lib/supabase/courses";
import { getAllStudentGameStates, getAllStrikesForCourse } from "@/lib/supabase/game";
import { getXpConfig, getBimestreConfig, getTitleRanges } from "@/lib/supabase/config";
import type { TitleRange } from "@/lib/supabase/config";
import { getProfilesFull } from "@/lib/supabase/profiles";
import { getFormativeClasses } from "@/lib/supabase/classes";
import { syncCourse } from "@/lib/sync/classroom";
import ResumenAcademico from "@/docente/components/ResumenAcademico";
import ConfigAdminPanel from "@/docente/components/ConfigAdminPanel";
import CourseTabNav from "@/docente/components/CourseTabNav";
import PanelDeAcciones from "@/docente/components/PanelDeAcciones";
import BimestreSelector from "@/docente/components/BimestreSelector";
import AlumnosTable from "@/docente/components/AlumnosTable";
import { Suspense } from "react";
import SyncStatus from "@/docente/components/SyncStatus";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

function getLevelInfo(level: number, titleRanges: TitleRange[]) {
  const matches = titleRanges.filter((r) => level >= r.level_min && level <= r.level_max);
  if (matches.length === 0) return null;
  return matches.reduce((best, r) => (r.level_min > best.level_min ? r : best));
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; bimestre?: string }>;
}) {
  const session = await auth();
  const email = session?.user?.email ?? "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken = (session as any)?.accessToken as string | undefined;
  const { id } = await params;
  const { tab = "resumen", bimestre: bimestreParam } = await searchParams;

  const allowed = await isTeacherOfCourse(id, email);
  if (!allowed) notFound();

  const course = await getCourseById(id);
  if (!course) notFound();

  // Auto-sync on page load — respects 5-min TTL, instant when data is fresh
  if (accessToken) {
    await syncCourse(id, accessToken, false).catch((e) =>
      console.error("[auto-sync] failed:", e instanceof Error ? e.message : e)
    );
  }

  const selectedBimestre = bimestreParam ?? course.bimestre_activo;

  const [gameStates, allStrikes] = await Promise.all([
    getAllStudentGameStates(id, selectedBimestre),
    getAllStrikesForCourse(id, selectedBimestre),
  ]);

  const emails = gameStates.map((s) => s.student_email);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/teacher"
          className="flex items-center gap-1 text-[11px] font-serif uppercase tracking-[0.15em] text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.85)] transition-colors"
        >
          <ArrowLeft size={12} />
          Inicio
        </Link>
        <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.15)] to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-start md:justify-between md:text-left">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-semibold text-[rgba(232,224,208,0.92)]">{course.name}</h1>
          {course.section && (
            <p className="mt-0.5 text-sm font-serif text-[rgba(160,125,55,0.55)]">
              {course.section} · {course.year}° año · {selectedBimestre}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 shrink-0 md:justify-start">
          <SyncStatus courseId={id} />
          <Link
            href={`/teacher/courses/${id}/setup`}
            className="flex items-center gap-1.5 border border-[rgba(160,125,55,0.28)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-[11px] font-serif uppercase tracking-[0.15em] text-[rgba(160,125,55,0.6)] hover:border-[rgba(200,168,75,0.45)] hover:text-[rgba(200,168,75,0.85)] transition-colors"
          >
            <Settings size={12} />
            Configurar tareas
          </Link>
        </div>
      </div>

      <Suspense fallback={<div className="h-10 border-b border-[rgba(160,125,55,0.2)]" />}>
        <CourseTabNav courseId={id} />
      </Suspense>

      {tab === "resumen" && (
        <ResumenAcademico gameStates={gameStates} bimestre={selectedBimestre} />
      )}

      {tab === "alumnos" && (
        <AlumnosTab
          gameStates={gameStates}
          courseId={id}
          bimestre={selectedBimestre}
          activeBimestre={course.bimestre_activo}
          allStrikes={allStrikes}
          emails={emails}
        />
      )}

      {tab === "acciones" && <PanelDeAcciones courseId={id} bimestre={selectedBimestre} />}

      {tab === "config" && <ConfigTab courseId={id} />}
    </div>
  );
}

async function AlumnosTab({
  gameStates,
  courseId,
  bimestre,
  activeBimestre,
  allStrikes,
  emails,
}: {
  gameStates: Awaited<ReturnType<typeof getAllStudentGameStates>>;
  courseId: string;
  bimestre: string;
  activeBimestre: string;
  allStrikes: Awaited<ReturnType<typeof getAllStrikesForCourse>>;
  emails: string[];
}) {
  const [profilesFull, formativeClasses, titleRanges] = await Promise.all([
    getProfilesFull(emails),
    getFormativeClasses(),
    getTitleRanges(courseId),
  ]);

  const classMap = new Map(formativeClasses.map((c) => [c.slug, c.title]));

  const strikesByStudent = new Map<string, typeof allStrikes>();
  for (const strike of allStrikes) {
    if (!strikesByStudent.has(strike.student_email)) {
      strikesByStudent.set(strike.student_email, []);
    }
    strikesByStudent.get(strike.student_email)!.push(strike);
  }

  const rows = gameStates.map((state) => {
    const profile = profilesFull.get(state.student_email);
    const displayName = profile?.display_name ?? state.student_email;
    const formativeSlug = profile?.formative_class ?? null;
    const formativeTitle = formativeSlug ? (classMap.get(formativeSlug) ?? formativeSlug) : "—";
    const levelInfo = getLevelInfo(state.level, titleRanges);
    const strikes = strikesByStudent.get(state.student_email) ?? [];
    const activeStrikes = strikes.filter((s) => s.active);
    return {
      email: state.student_email,
      displayName,
      level: state.level,
      levelTitle: levelInfo?.title ?? null,
      levelRole: levelInfo?.role ?? null,
      xpTotal: state.xp_total,
      formativeTitle,
      strikesActive: state.strikes_active,
      blocked: state.blocked,
      activeStrikes,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <BimestreSelector currentBimestre={bimestre} activeBimestre={activeBimestre} />
        </Suspense>
      </div>
      <AlumnosTable rows={rows} courseId={courseId} bimestre={bimestre} />
    </div>
  );
}

async function ConfigTab({ courseId }: { courseId: string }) {
  const [xpConfig, bimestreConfig, titleRanges] = await Promise.all([
    getXpConfig(courseId),
    getBimestreConfig(courseId),
    getTitleRanges(courseId),
  ]);
  return (
    <ConfigAdminPanel
      courseId={courseId}
      xpConfig={xpConfig}
      bimestreConfig={bimestreConfig}
      titleRanges={titleRanges}
    />
  );
}
