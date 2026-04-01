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
        <p className="text-sm text-[#9aab8a]">
          Acciones ejecutadas sobre uno o más alumnos del curso.
        </p>
        <AccionModal courseId={courseId} students={students} talents={talents} />
      </div>

      {actions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#1e3320] p-12 text-center">
          <p className="text-[#9aab8a]">Sin acciones registradas aún.</p>
          <p className="mt-1 text-xs text-[#9aab8a]">
            Usá "Nueva Acción" para aplicar strikes, XP, talentos o desbloqueos en masa.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#0d1a0f] px-2 py-0.5 text-xs font-medium text-[#c9a227]">
                      {ACTION_LABELS[action.type] ?? action.type}
                    </span>
                    {action.xp_value && (
                      <span className="text-xs text-[#8fbc8f]">+{action.xp_value} XP</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#f5f0e8]">{action.title}</p>
                  {action.description && (
                    <p className="text-xs text-[#9aab8a]">{action.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-[#9aab8a]">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(action.created_at).toLocaleDateString("es-AR", {
                      dateStyle: "short",
                    })}
                  </span>
                  {action.updated_at !== action.created_at && (
                    <span className="text-[10px] text-[#9aab8a]/60">
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
                      <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[#9aab8a] transition-colors hover:bg-[#1e3320] hover:text-[#c9a227]">
                        <Pencil size={10} />
                        Editar
                      </span>
                    }
                  />
                </div>
              </div>

              {action.affected_emails.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1 border-t border-[#1e3320] pt-3">
                  {action.affected_emails.map((email) => {
                    const name = profilesFull.get(email)?.display_name ?? email;
                    return (
                      <span
                        key={email}
                        className="rounded border border-[#1e3320] px-2 py-0.5 text-xs text-[#9aab8a]"
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
