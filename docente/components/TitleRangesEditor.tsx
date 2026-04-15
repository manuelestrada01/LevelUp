"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import type { TitleRange } from "@/lib/supabase/config";

interface Props {
  courseId: string;
  initialRanges: TitleRange[];
}

function emptyRange(courseId: string): TitleRange {
  return { course_id: courseId, title: "", role: "", level_min: 1, level_max: 5, sort_order: 0 };
}

export default function TitleRangesEditor({ courseId, initialRanges }: Props) {
  const [ranges, setRanges] = useState<TitleRange[]>(
    initialRanges.length > 0 ? initialRanges : []
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addRow() {
    setRanges((prev) => [...prev, emptyRange(courseId)]);
    setSaved(false);
    setError(null);
  }

  function removeRow(index: number) {
    setRanges((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
    setError(null);
  }

  function update(index: number, field: keyof TitleRange, value: string | number) {
    setRanges((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
    setSaved(false);
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/config/${courseId}/title-ranges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ranges.map((r, i) => ({ ...r, sort_order: i }))),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Error ${res.status} al guardar`);
      }
    } catch {
      setError("Error de red al guardar");
    }
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {ranges.length > 0 ? (
        <div className="chronicle-stone relative overflow-hidden">
          <table className="w-full text-sm">
            <thead
              className="text-left text-[11px] font-serif uppercase tracking-[0.15em]"
              style={{ background: "rgba(160,125,55,0.07)", borderBottom: "1px solid rgba(160,125,55,0.18)" }}
            >
              <tr>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Título</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Rol</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Nv. Mín</th>
                <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Nv. Máx</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(160,125,55,0.1)]">
              {ranges.map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-[rgba(160,125,55,0.03)]">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={r.title}
                      onChange={(e) => update(i, "title", e.target.value)}
                      placeholder="ej. Iniciación"
                      className="w-full border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={r.role}
                      onChange={(e) => update(i, "role", e.target.value)}
                      placeholder="ej. Aprendiz"
                      className="w-full border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1}
                      max={36}
                      value={r.level_min}
                      onChange={(e) => update(i, "level_min", Number(e.target.value))}
                      className="w-16 border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-center text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1}
                      max={36}
                      value={r.level_max}
                      onChange={(e) => update(i, "level_max", Number(e.target.value))}
                      className="w-16 border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-center text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removeRow(i)}
                      className="text-[rgba(160,125,55,0.45)] transition-colors hover:text-[#c0392b]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-[rgba(160,125,55,0.25)] p-6 text-center text-xs font-serif text-[rgba(160,125,55,0.55)]">
          Sin rangos definidos. Agregá uno para configurar los títulos y roles por nivel.
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={addRow}
          className="flex items-center gap-2 border border-[rgba(200,168,75,0.3)] px-4 py-2 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(200,168,75,0.75)] transition-colors hover:bg-[rgba(200,168,75,0.08)]"
        >
          <Plus size={13} />
          Agregar rango
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 border border-[rgba(200,168,75,0.5)] bg-[rgba(200,168,75,0.12)] px-4 py-2 text-[11px] font-serif uppercase tracking-[0.12em] text-[rgba(200,168,75,0.9)] transition-colors hover:bg-[rgba(200,168,75,0.2)] disabled:opacity-40"
        >
          <Save size={13} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
        {saved && <span className="text-xs font-serif text-[rgba(143,188,143,0.8)]">Guardado</span>}
        {error && <span className="text-xs text-[#c0392b]">{error}</span>}
      </div>
    </div>
  );
}
