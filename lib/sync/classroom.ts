import { getCourseById, getCourseworkConfig } from "@/lib/supabase/courses";
import {
  upsertDeliveries,
  upsertGameState,
  getActiveStrikes,
  addStrike,
  getAllStudentGameStates,
} from "@/lib/supabase/game";
import { calcNivelFromXp, XP_POR_TIPO, XP_BONUS_TEMPRANA } from "@/xp/engine";
import { getXpConfig } from "@/lib/supabase/config";
import { getCourseRoster, getAllSubmissions, getCourseWorkList } from "@/lib/google/classroom";

const SYNC_TTL_MS = 5 * 60 * 1000;

export async function syncCourse(
  courseId: string,
  accessToken: string,
  force = false
): Promise<{ synced: boolean; studentCount: number }> {
  const course = await getCourseById(courseId);
  if (!course) throw new Error(`Course ${courseId} not found`);

  if (!force) {
    const states = await getAllStudentGameStates(courseId, course.bimestre_activo);
    if (states.length > 0) {
      const latest = states.reduce((a, b) =>
        new Date(a.updated_at) > new Date(b.updated_at) ? a : b
      );
      if (Date.now() - new Date(latest.updated_at).getTime() < SYNC_TTL_MS) {
        return { synced: false, studentCount: states.length };
      }
    }
  }

  const [courseworkConfigs, classroomWork, roster, xpConfigEntries] = await Promise.all([
    getCourseworkConfig(courseId),
    getCourseWorkList(accessToken, course.classroom_id),
    getCourseRoster(accessToken, course.classroom_id),
    getXpConfig(courseId),
  ]);

  const xpByTipo: Record<string, { base: number; early: number }> = {};
  for (const entry of xpConfigEntries) {
    xpByTipo[entry.tipo] = { base: entry.xp_base, early: entry.xp_early };
  }

  const configMap = new Map(courseworkConfigs.map((c) => [c.classroom_coursework_id, c]));
  const configuredWorkIds = courseworkConfigs.map((c) => c.classroom_coursework_id);

  if (configuredWorkIds.length === 0) {
    return { synced: true, studentCount: roster.length };
  }

  const allSubmissions = await getAllSubmissions(accessToken, course.classroom_id, configuredWorkIds);

  const submissionsByWork = new Map<string, Map<string, (typeof allSubmissions)[0]>>();
  for (const sub of allSubmissions) {
    if (!sub.courseWorkId || !sub.userId) continue;
    if (!submissionsByWork.has(sub.courseWorkId)) {
      submissionsByWork.set(sub.courseWorkId, new Map());
    }
    submissionsByWork.get(sub.courseWorkId)!.set(sub.userId, sub);
  }

  const workDueDates = new Map<string, Date | null>();
  for (const cw of classroomWork) {
    if (!cw.id || !configMap.has(cw.id)) continue;
    const dd = cw.dueDate;
    const dt = cw.dueTime;
    if (dd?.year && dd?.month && dd?.day) {
      workDueDates.set(
        cw.id,
        new Date(Date.UTC(dd.year, dd.month - 1, dd.day, dt?.hours ?? 23, dt?.minutes ?? 59, 0))
      );
    } else {
      workDueDates.set(cw.id, null);
    }
  }

  type DeliveryInput = Parameters<typeof upsertDeliveries>[0][number];
  const deliveriesToUpsert: DeliveryInput[] = [];
  const studentXpMap = new Map<string, number>();
  const studentNewStrikeReasons = new Map<string, Array<{ reason: string; cwId: string }>>();

  for (const student of roster) {
    const email = student.profile?.emailAddress;
    if (!email) continue;
    studentXpMap.set(email, 0);
    studentNewStrikeReasons.set(email, []);
  }

  for (const cwId of configuredWorkIds) {
    const config = configMap.get(cwId)!;
    const dueDate = workDueDates.get(cwId) ?? null;
    const subsForWork = submissionsByWork.get(cwId) ?? new Map();

    for (const student of roster) {
      const email = student.profile?.emailAddress;
      if (!email || !student.userId) continue;

      const sub = subsForWork.get(student.userId);
      const subState = sub?.state;

      let status: "OK" | "LATE" | "MISSING";
      let submittedAt: Date | null = null;
      let isEarly = false;

      if (!sub || subState === "NEW" || subState === "CREATED" || subState === "RECLAIMED_BY_STUDENT") {
        status = "MISSING";
      } else if (subState === "TURNED_IN" || subState === "RETURNED") {
        const turnedInHistory = sub.submissionHistory?.find(
          (h: { stateHistory?: { state?: string; stateTimestamp?: string } }) =>
            h.stateHistory?.state === "TURNED_IN"
        );
        const turnedInTime = turnedInHistory?.stateHistory?.stateTimestamp ?? sub.updateTime;
        submittedAt = turnedInTime ? new Date(turnedInTime) : null;

        if (submittedAt && dueDate) {
          status = submittedAt > dueDate ? "LATE" : "OK";
          if (status === "OK") {
            isEarly = dueDate.getTime() - submittedAt.getTime() >= 24 * 60 * 60 * 1000;
          }
        } else {
          status = "OK";
        }
      } else {
        status = "MISSING";
      }

      const xpEntry = xpByTipo[config.tipo] ?? { base: XP_POR_TIPO[config.tipo] ?? 0, early: XP_BONUS_TEMPRANA };
      const xpBase = status === "OK" ? xpEntry.base : 0;
      const xpBonus = status === "OK" && isEarly ? xpEntry.early : 0;

      deliveriesToUpsert.push({
        course_id: courseId,
        student_email: email,
        classroom_coursework_id: cwId,
        bimestre: course.bimestre_activo,
        tipo: config.tipo,
        submitted_at: submittedAt?.toISOString() ?? null,
        due_at: dueDate?.toISOString() ?? null,
        is_early: isEarly,
        status,
        xp_base: xpBase,
        xp_bonus: xpBonus,
      });

      studentXpMap.set(email, (studentXpMap.get(email) ?? 0) + xpBase + xpBonus);

      if (status === "MISSING") {
        studentNewStrikeReasons.get(email)?.push({ reason: "no_submission", cwId });
      } else if (status === "LATE") {
        studentNewStrikeReasons.get(email)?.push({ reason: "late_submission", cwId });
      }
    }
  }

  await upsertDeliveries(deliveriesToUpsert);

  for (const student of roster) {
    const email = student.profile?.emailAddress;
    if (!email) continue;

    const xpTotal = studentXpMap.get(email) ?? 0;
    const nivel = calcNivelFromXp(xpTotal);
    const currentStrikes = await getActiveStrikes(courseId, email, course.bimestre_activo);
    const existingCwIds = new Set(
      currentStrikes.map((s) => s.classroom_coursework_id).filter(Boolean)
    );

    for (const { reason, cwId } of studentNewStrikeReasons.get(email) ?? []) {
      if (!existingCwIds.has(cwId)) {
        await addStrike({
          course_id: courseId,
          student_email: email,
          bimestre: course.bimestre_activo,
          reason,
          classroom_coursework_id: cwId,
          active: true,
        });
      }
    }

    const freshStrikes = await getActiveStrikes(courseId, email, course.bimestre_activo);
    const strikesActive = freshStrikes.length;
    const blocked = strikesActive >= 3;

    await upsertGameState({
      course_id: courseId,
      student_email: email,
      bimestre: course.bimestre_activo,
      xp_total: blocked ? 0 : xpTotal,
      level: blocked ? 1 : nivel,
      strikes_active: strikesActive,
      blocked,
      blocked_at: blocked ? new Date().toISOString() : null,
    });
  }

  return { synced: true, studentCount: roster.length };
}
