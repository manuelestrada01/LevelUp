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
        <div className="overflow-hidden rounded-xl border border-[#1e3320]">
          <table className="w-full text-sm">
            <thead className="bg-[#1a2e1c] text-left text-xs text-[#9aab8a]">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Nv. Mín</th>
                <th className="px-4 py-3">Nv. Máx</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3320] bg-[#0d1a0f]">
              {ranges.map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={r.title}
                      onChange={(e) => update(i, "title", e.target.value)}
                      placeholder="ej. Iniciación"
                      className="w-full rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={r.role}
                      onChange={(e) => update(i, "role", e.target.value)}
                      placeholder="ej. Aprendiz"
                      className="w-full rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1}
                      max={36}
                      value={r.level_min}
                      onChange={(e) => update(i, "level_min", Number(e.target.value))}
                      className="w-16 rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1}
                      max={36}
                      value={r.level_max}
                      onChange={(e) => update(i, "level_max", Number(e.target.value))}
                      className="w-16 rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removeRow(i)}
                      className="text-[#9aab8a] hover:text-[#c0392b] transition-colors"
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
        <div className="rounded-xl border border-dashed border-[#1e3320] p-6 text-center text-xs text-[#9aab8a]">
          Sin rangos definidos. Agregá uno para configurar los títulos y roles por nivel.
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={addRow}
          className="flex items-center gap-2 rounded-lg border border-[#1e3320] px-4 py-2 text-sm text-[#9aab8a] transition-colors hover:border-[#c9a227]/40 hover:text-[#c9a227]"
        >
          <Plus size={14} />
          Agregar rango
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-medium text-[#0d1a0f] disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
        {saved && <span className="text-xs text-[#8fbc8f]">Guardado</span>}
        {error && <span className="text-xs text-[#c0392b]">{error}</span>}
      </div>
    </div>
  );
}
