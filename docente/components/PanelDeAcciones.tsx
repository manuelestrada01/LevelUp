import { getAllStudentGameStates } from "@/lib/supabase/game";
import { getProfilesFull } from "@/lib/supabase/profiles";
import { getTalentConfig } from "@/lib/supabase/config";
import { getActionGroups } from "@/lib/supabase/actions";
import AccionModal from "./AccionModal";
import { Calendar, Users, Pencil } from "lucide-react";

const ACTION_LABELS: Record<string, string> = {
  strike_force: "Strike forzado",
  strike_annul: "Strike anulado",
  mission_annul: "Efecto de Misión anulado",
  unlock: "Desbloqueo forzado",
  xp_event: "Evento XP",
  xp_quality: "Calidad Técnica Destacada",
  xp_extraordinary: "Evaluación Extraordinaria",
  talent: "Talento otorgado",
};

interface Props {
  courseId: string;
  bimestre: string;
}

export default async function PanelDeAcciones({ courseId, bimestre }: Props) {
  const [actions, gameStates, talents] = await Promise.all([
    getActionGroups(courseId),
    getAllStudentGameStates(courseId, bimestre),
    getTalentConfig(),
  ]);

  const emails = gameStates.map((s) => s.student_email);
  const profilesFull = await getProfilesFull(emails);

  const students = gameStates.map((s) => ({
    email: s.student_email,
    displayName: profilesFull.get(s.student_email)?.display_name ?? s.student_email,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.5)]">
          Acciones ejecutadas sobre uno o más alumnos del curso.
        </p>
        <AccionModal courseId={courseId} students={students} talents={talents} />
      </div>

      {actions.length === 0 ? (
        <div className="border border-dashed border-[rgba(160,125,55,0.2)] p-12 text-center">
          <p className="font-serif text-[rgba(160,125,55,0.5)]">Sin acciones registradas aún.</p>
          <p className="mt-1 text-xs font-serif text-[rgba(160,125,55,0.35)]">
            Usá "Nueva Acción" para aplicar strikes, XP, talentos o desbloqueos en masa.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="chronicle-stone relative p-4"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.03)_0%,transparent_60%)]" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="border border-[rgba(200,168,75,0.3)] bg-[rgba(200,168,75,0.08)] px-2 py-0.5 text-[10px] font-serif uppercase tracking-widest text-[rgba(200,168,75,0.8)]">
                      {ACTION_LABELS[action.type] ?? action.type}
                    </span>
                    {action.xp_value && (
                      <span className="text-xs font-serif text-[rgba(143,188,143,0.8)]">+{action.xp_value} XP</span>
                    )}
                  </div>
                  <p className="font-serif font-semibold text-[rgba(232,224,208,0.9)]">{action.title}</p>
                  {action.description && (
                    <p className="text-xs font-serif text-[rgba(160,125,55,0.55)]">{action.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-[11px] font-serif text-[rgba(160,125,55,0.5)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(action.created_at).toLocaleDateString("es-AR", {
                      dateStyle: "short",
                    })}
                  </span>
                  {action.updated_at !== action.created_at && (
                    <span className="text-[10px] text-[rgba(160,125,55,0.35)]">
                      Editado {new Date(action.updated_at).toLocaleDateString("es-AR", { dateStyle: "short" })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users size={10} />
                    {action.affected_emails.length} alumno
                    {action.affected_emails.length !== 1 ? "s" : ""}
                  </span>
                  <AccionModal
                    courseId={courseId}
                    students={students}
                    talents={talents}
                    action={action}
                    trigger={
                      <span className="flex items-center gap-1 px-1.5 py-0.5 text-[rgba(160,125,55,0.45)] transition-colors hover:text-[rgba(200,168,75,0.85)]">
                        <Pencil size={10} />
                        Editar
                      </span>
                    }
                  />
                </div>
              </div>

              {action.affected_emails.length > 0 && (
                <div className="relative z-10 mt-3 flex flex-wrap gap-1 border-t border-[rgba(160,125,55,0.12)] pt-3">
                  {action.affected_emails.map((email) => {
                    const name = profilesFull.get(email)?.display_name ?? email;
                    return (
                      <span
                        key={email}
                        className="border border-[rgba(160,125,55,0.2)] bg-[rgba(160,125,55,0.04)] px-2 py-0.5 text-[11px] font-serif text-[rgba(160,125,55,0.55)]"
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
