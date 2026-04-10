import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { isTeacherOfCourse, getCourseById } from "@/lib/supabase/courses";
import {
  addStrike,
  getActiveStrikes,
  annulStrike,
  getStudentGameState,
  upsertGameState,
} from "@/lib/supabase/game";
import { logException, grantTalent } from "@/lib/supabase/teacher";
import { calcNivelFromXp } from "@/xp/engine";
import { createActionGroup, getActionGroups, type ActionType } from "@/lib/supabase/actions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;
  const allowed = await isTeacherOfCourse(courseId, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const actions = await getActionGroups(courseId);
  return NextResponse.json(actions);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;
  const allowed = await isTeacherOfCourse(courseId, session.user.email);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const course = await getCourseById(courseId);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const body = await req.json() as {
    type: ActionType;
    title: string;
    description?: string;
    strike_reason?: string;
    xp_value?: number;
    talent_slug?: string;
    affected_emails: string[];
  };

  const { type, title, description, strike_reason, xp_value, talent_slug, affected_emails } = body;

  if (!type || !affected_emails?.length) {
    return NextResponse.json({ error: "type and affected_emails are required" }, { status: 400 });
  }

  // Save the action group
  const actionGroup = await createActionGroup({
    course_id: courseId,
    type,
    subtype: null,
    title,
    description: description ?? null,
    xp_value: xp_value ?? null,
    talent_slug: talent_slug ?? null,
    affected_emails,
    created_by: session.user.email,
  });

  // Execute action on each affected student
  const errors: string[] = [];

  for (const studentEmail of affected_emails) {
    try {
      await executeAction({
        type,
        courseId,
        studentEmail,
        bimestre: course.bimestre_activo,
        description: description ?? null,
        strikeReason: strike_reason ?? "no_submission",
        xpValue: xp_value ?? 0,
        talentSlug: talent_slug ?? null,
        createdBy: session.user.email,
      });
    } catch (e) {
      errors.push(`${studentEmail}: ${e instanceof Error ? e.message : "error"}`);
    }
  }

  return NextResponse.json({ ok: true, actionGroup, errors }, { status: 201 });
}

async function executeAction(opts: {
  type: ActionType;
  courseId: string;
  studentEmail: string;
  bimestre: string;
  description: string | null;
  strikeReason: string;
  xpValue: number;
  talentSlug: string | null;
  createdBy: string;
}) {
  const { type, courseId, studentEmail, bimestre, description, strikeReason, xpValue, talentSlug, createdBy } = opts;

  switch (type) {
    case "strike_force": {
      const strike = await addStrike({
        course_id: courseId,
        student_email: studentEmail,
        bimestre,
        reason: strikeReason,
        classroom_coursework_id: null,
        active: true,
      });
      await updateGameStateStrikes(courseId, studentEmail, bimestre, createdBy);
      await logException({
        course_id: courseId,
        student_email: studentEmail,
        type: "manual_xp",
        notes: `Strike forzado: ${reason}`,
        value: null,
        created_by: createdBy,
      });
      return strike;
    }

    case "strike_annul": {
      const active = await getActiveStrikes(courseId, studentEmail, bimestre);
      if (active.length > 0) {
        await annulStrike(active[0].id, createdBy);
        await updateGameStateStrikes(courseId, studentEmail, bimestre, createdBy);
        await logException({
          course_id: courseId,
          student_email: studentEmail,
          type: "annul_strike",
          notes: description ?? "Strike anulado por acción docente",
          value: null,
          created_by: createdBy,
        });
      }
      break;
    }

    case "mission_annul": {
      const active = await getActiveStrikes(courseId, studentEmail, bimestre);
      const missionStrikes = active.filter((s) => s.classroom_coursework_id !== null);
      if (missionStrikes.length > 0) {
        await annulStrike(missionStrikes[0].id, createdBy);
        await updateGameStateStrikes(courseId, studentEmail, bimestre, createdBy);
        await logException({
          course_id: courseId,
          student_email: studentEmail,
          type: "annul_strike",
          notes: description ?? "Efecto de misión anulado por acción docente",
          value: null,
          created_by: createdBy,
        });
      }
      break;
    }

    case "unlock": {
      const active = await getActiveStrikes(courseId, studentEmail, bimestre);
      await Promise.all(active.map((s) => annulStrike(s.id, createdBy)));
      const gameState = await getStudentGameState(courseId, studentEmail, bimestre);
      if (gameState) {
        await upsertGameState({
          ...gameState,
          strikes_active: 0,
          blocked: false,
          blocked_at: null,
        });
      }
      await logException({
        course_id: courseId,
        student_email: studentEmail,
        type: "force_unlock",
        notes: description ?? "Desbloqueo por acción docente",
        value: null,
        created_by: createdBy,
      });
      break;
    }

    case "xp_event":
    case "xp_quality":
    case "xp_extraordinary": {
      const gameState = await getStudentGameState(courseId, studentEmail, bimestre);
      if (gameState) {
        const newXp = gameState.xp_total + xpValue;
        await upsertGameState({
          ...gameState,
          xp_total: newXp,
          level: calcNivelFromXp(newXp),
        });
        await logException({
          course_id: courseId,
          student_email: studentEmail,
          type: "manual_xp",
          notes: description ?? `+${xpValue} XP`,
          value: xpValue,
          created_by: createdBy,
        });
      }
      break;
    }

    case "talent": {
      if (talentSlug) {
        await grantTalent(courseId, studentEmail, talentSlug, createdBy);
      }
      break;
    }
  }
}

async function updateGameStateStrikes(
  courseId: string,
  studentEmail: string,
  bimestre: string,
  _createdBy: string
) {
  const [freshStrikes, gameState] = await Promise.all([
    getActiveStrikes(courseId, studentEmail, bimestre),
    getStudentGameState(courseId, studentEmail, bimestre),
  ]);
  if (!gameState) return;
  const blocked = freshStrikes.length >= 3;
  await upsertGameState({
    ...gameState,
    strikes_active: freshStrikes.length,
    blocked,
    blocked_at: blocked && !gameState.blocked ? new Date().toISOString() : gameState.blocked_at,
    xp_total: blocked ? 0 : gameState.xp_total,
    level: blocked ? 1 : gameState.level,
  });
}
