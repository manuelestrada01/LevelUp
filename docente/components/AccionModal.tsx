"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Search, CheckSquare, Square } from "lucide-react";
import type { TalentConfigEntry } from "@/lib/supabase/config";
import type { ActionType, ActionGroup } from "@/lib/supabase/actions";

interface Student {
  email: string;
  displayName: string;
}

interface Props {
  courseId: string;
  students: Student[];
  talents: TalentConfigEntry[];
  /** Si se pasa, el modal funciona en modo edición */
  action?: ActionGroup;
  trigger?: React.ReactNode;
}

const ACTION_OPTIONS: { value: ActionType; label: string }[] = [
  { value: "strike_force", label: "Strike — Forzar" },
  { value: "strike_annul", label: "Strike — Anular" },
  { value: "mission_annul", label: "Anular Efecto de Misión" },
  { value: "unlock", label: "Desbloqueo forzado" },
  { value: "xp_event", label: "Evento (XP)" },
  { value: "xp_quality", label: "Calidad Técnica Destacada" },
  { value: "xp_extraordinary", label: "Evaluación Extraordinaria" },
  { value: "talent", label: "Talento" },
];

const STRIKE_REASONS = [
  { value: "missing_material", label: "No trajo materiales" },
  { value: "no_submission", label: "No entrega" },
  { value: "late_submission", label: "Entrega tardía" },
];

export default function AccionModal({ courseId, students, talents, action, trigger }: Props) {
  const router = useRouter();
  const isEdit = !!action;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<ActionType>((action?.type as ActionType) ?? "strike_force");
  const [strikeReason, setStrikeReason] = useState("no_submission");
  const [description, setDescription] = useState(action?.description ?? "");
  const [xpValue, setXpValue] = useState(action?.xp_value ?? 20);
  const [talentSlug, setTalentSlug] = useState(action?.talent_slug ?? talents[0]?.slug ?? "");
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(
    new Set(action?.affected_emails ?? [])
  );
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (s) =>
          s.displayName.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      ),
    [students, search]
  );

  function toggleStudent(email: string) {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  }

  function selectAll() {
    setSelectedEmails(new Set(filteredStudents.map((s) => s.email)));
  }

  function deselectAll() {
    setSelectedEmails(new Set());
  }

  function close() {
    setOpen(false);
    setError(null);
    setSelectedEmails(new Set());
    setSearch("");
    setDescription("");
  }

  function buildTitle(): string {
    const opt = ACTION_OPTIONS.find((o) => o.value === type);
    return opt?.label ?? type;
  }

  function buildDescription(): string {
    if (type === "strike_force") {
      const r = STRIKE_REASONS.find((r) => r.value === strikeReason);
      return description ? `${r?.label ?? strikeReason}: ${description}` : (r?.label ?? strikeReason);
    }
    return description;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedEmails.size === 0) {
      setError("Seleccioná al menos un alumno.");
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      type,
      title: buildTitle(),
      description: buildDescription() || null,
      strike_reason: type === "strike_force" ? strikeReason : undefined,
      xp_value: ["xp_event", "xp_quality", "xp_extraordinary"].includes(type) ? xpValue : undefined,
      talent_slug: type === "talent" ? talentSlug : undefined,
      affected_emails: [...selectedEmails],
    };

    const res = isEdit
      ? await fetch(`/api/actions/${courseId}/${action!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/actions/${courseId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Error al ejecutar la acción.");
      return;
    }

    close();
    router.refresh();
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">{trigger}</div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 border border-[rgba(200,168,75,0.45)] bg-[rgba(200,168,75,0.1)] px-4 py-2 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(200,168,75,0.85)] transition-colors hover:bg-[rgba(200,168,75,0.18)]"
        >
          <Plus size={13} />
          Nueva Acción
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" style={{ backdropFilter: "blur(2px)" }}>
          <div className="chronicle-stone relative flex w-full max-w-2xl flex-col gap-5 p-6 shadow-2xl">
            {/* Corner bracket ornaments */}
            <div className="pointer-events-none absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-[rgba(200,168,75,0.4)]" />
            <div className="pointer-events-none absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-[rgba(200,168,75,0.4)]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[rgba(200,168,75,0.4)]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[rgba(200,168,75,0.4)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />

            <div className="relative z-10 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-[rgba(232,224,208,0.92)]">
                {isEdit ? "Editar Acción" : "Nueva Acción"}
              </h2>
              <button onClick={close} className="text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.85)] transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              {/* Tipo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Tipo de acción</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ActionType)}
                  className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)]"
                >
                  {ACTION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#131418]">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Razón de strike */}
              {type === "strike_force" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Motivo del strike</label>
                  <div className="flex flex-col gap-1.5">
                    {STRIKE_REASONS.map((r) => (
                      <label key={r.value} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="strikeReason"
                          value={r.value}
                          checked={strikeReason === r.value}
                          onChange={() => setStrikeReason(r.value)}
                          className="accent-[#c9a227]"
                        />
                        <span className="text-sm font-serif text-[rgba(232,224,208,0.85)]">{r.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* XP value */}
              {["xp_event", "xp_quality", "xp_extraordinary"].includes(type) && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">XP a otorgar</label>
                  <input
                    type="number"
                    min={1}
                    value={xpValue}
                    onChange={(e) => setXpValue(Number(e.target.value))}
                    className="w-32 border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)]"
                  />
                </div>
              )}

              {/* Talent selector */}
              {type === "talent" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Talento</label>
                  <select
                    value={talentSlug}
                    onChange={(e) => setTalentSlug(e.target.value)}
                    className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)]"
                  >
                    {talents.filter((t) => t.active).map((t) => (
                      <option key={t.slug} value={t.slug} className="bg-[#131418]">
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Descripción libre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">
                  {type === "strike_force" ? "Notas adicionales (opcional)" : "Descripción"}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Ingresá una descripción..."
                  className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)] resize-none placeholder:text-[rgba(160,125,55,0.3)]"
                />
              </div>

              {/* Alumnos afectados */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">
                    Alumnos afectados ({selectedEmails.size} seleccionados)
                  </label>
                  <div className="flex gap-2 text-[11px] font-serif">
                    <button type="button" onClick={selectAll} className="flex items-center gap-1 text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.85)] transition-colors">
                      <CheckSquare size={12} /> Todos
                    </button>
                    <button type="button" onClick={deselectAll} className="flex items-center gap-1 text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.85)] transition-colors">
                      <Square size={12} /> Ninguno
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(160,125,55,0.45)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar alumno..."
                    className="w-full border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] py-2 pl-8 pr-3 text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)] placeholder:text-[rgba(160,125,55,0.3)]"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto border border-[rgba(160,125,55,0.2)]">
                  {filteredStudents.map((s) => {
                    const selected = selectedEmails.has(s.email);
                    return (
                      <label
                        key={s.email}
                        className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors ${
                          selected ? "bg-[rgba(200,168,75,0.08)]" : "hover:bg-[rgba(160,125,55,0.04)]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleStudent(s.email)}
                          className="accent-[#c9a227]"
                        />
                        <span className="font-serif text-[rgba(232,224,208,0.85)]">{s.displayName}</span>
                        {s.displayName !== s.email && (
                          <span className="text-xs font-serif text-[rgba(160,125,55,0.45)]">{s.email}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-xs font-serif text-[#c0392b]">{error}</p>}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="border border-[rgba(160,125,55,0.2)] px-4 py-2 text-sm font-serif text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.85)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="border border-[rgba(200,168,75,0.5)] bg-[rgba(200,168,75,0.12)] px-5 py-2 text-sm font-serif uppercase tracking-[0.12em] text-[rgba(200,168,75,0.9)] disabled:opacity-40 hover:bg-[rgba(200,168,75,0.2)] transition-colors"
                >
                  {loading
                    ? isEdit ? "Guardando..." : "Ejecutando..."
                    : isEdit ? "Guardar cambios" : "Ejecutar acción"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
