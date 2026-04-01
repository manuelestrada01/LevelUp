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
  { value: "missing_materials", label: "No trajo materiales" },
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
          className="flex items-center gap-2 rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-medium text-[#0d1a0f] transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          Nueva Acción
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-[#1e3320] bg-[#0d1a0f] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-[#f5f0e8]">
                {isEdit ? "Editar Acción" : "Nueva Acción"}
              </h2>
              <button onClick={close} className="text-[#9aab8a] hover:text-[#f5f0e8]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Tipo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#9aab8a]">Tipo de acción</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ActionType)}
                  className="rounded-lg border border-[#1e3320] bg-[#1a2e1c] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                >
                  {ACTION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Razón de strike */}
              {type === "strike_force" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#9aab8a]">Motivo del strike</label>
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
                        <span className="text-sm text-[#f5f0e8]">{r.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* XP value */}
              {["xp_event", "xp_quality", "xp_extraordinary"].includes(type) && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#9aab8a]">XP a otorgar</label>
                  <input
                    type="number"
                    min={1}
                    value={xpValue}
                    onChange={(e) => setXpValue(Number(e.target.value))}
                    className="w-32 rounded-lg border border-[#1e3320] bg-[#1a2e1c] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                  />
                </div>
              )}

              {/* Talent selector */}
              {type === "talent" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#9aab8a]">Talento</label>
                  <select
                    value={talentSlug}
                    onChange={(e) => setTalentSlug(e.target.value)}
                    className="rounded-lg border border-[#1e3320] bg-[#1a2e1c] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                  >
                    {talents.filter((t) => t.active).map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Descripción libre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#9aab8a]">
                  {type === "strike_force" ? "Notas adicionales (opcional)" : "Descripción"}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Ingresá una descripción..."
                  className="rounded-lg border border-[#1e3320] bg-[#1a2e1c] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227] resize-none"
                />
              </div>

              {/* Alumnos afectados */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#9aab8a]">
                    Alumnos afectados ({selectedEmails.size} seleccionados)
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button type="button" onClick={selectAll} className="flex items-center gap-1 text-[#9aab8a] hover:text-[#c9a227]">
                      <CheckSquare size={12} /> Todos
                    </button>
                    <button type="button" onClick={deselectAll} className="flex items-center gap-1 text-[#9aab8a] hover:text-[#f5f0e8]">
                      <Square size={12} /> Ninguno
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aab8a]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar alumno..."
                    className="w-full rounded-lg border border-[#1e3320] bg-[#1a2e1c] py-2 pl-8 pr-3 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto rounded-lg border border-[#1e3320]">
                  {filteredStudents.map((s) => {
                    const selected = selectedEmails.has(s.email);
                    return (
                      <label
                        key={s.email}
                        className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors ${
                          selected ? "bg-[#c9a227]/10" : "hover:bg-[#1a2e1c]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleStudent(s.email)}
                          className="accent-[#c9a227]"
                        />
                        <span className="text-[#f5f0e8]">{s.displayName}</span>
                        {s.displayName !== s.email && (
                          <span className="text-xs text-[#9aab8a]">{s.email}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-xs text-[#c0392b]">{error}</p>}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg border border-[#1e3320] px-4 py-2 text-sm text-[#9aab8a] hover:text-[#f5f0e8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#c9a227] px-5 py-2 text-sm font-medium text-[#0d1a0f] disabled:opacity-50"
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
