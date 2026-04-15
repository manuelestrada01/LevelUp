"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { XpConfigEntry } from "@/lib/supabase/config";

interface Props {
  courseId: string;
  initialEntries: XpConfigEntry[];
}

export default function XpConfigEditor({ courseId, initialEntries }: Props) {
  const [entries, setEntries] = useState<XpConfigEntry[]>(
    initialEntries.map((e) => ({ ...e, course_id: courseId }))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(index: number, field: keyof XpConfigEntry, value: string | number) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/config/${courseId}/xp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entries),
    });
    setSaved(res.ok);
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="chronicle-stone relative overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] font-serif uppercase tracking-[0.15em]" style={{ background: "rgba(160,125,55,0.07)", borderBottom: "1px solid rgba(160,125,55,0.18)" }}>
            <tr>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Tipo</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Etiqueta</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">XP Base</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Bonus Temprana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(160,125,55,0.1)]">
            {entries.map((entry, i) => (
              <tr key={entry.tipo} className="hover:bg-[rgba(160,125,55,0.03)] transition-colors">
                <td className="px-4 py-3 font-mono text-sm text-[rgba(200,168,75,0.8)]">{entry.tipo}</td>
                <td className="px-4 py-3">
                  <input
                    value={entry.label}
                    onChange={(e) => update(i, "label", e.target.value)}
                    className="w-full border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={entry.xp_base}
                    onChange={(e) => update(i, "xp_base", parseInt(e.target.value) || 0)}
                    className="w-20 border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={entry.xp_early}
                    onChange={(e) => update(i, "xp_early", parseInt(e.target.value) || 0)}
                    className="w-20 border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 border border-[rgba(200,168,75,0.5)] bg-[rgba(200,168,75,0.12)] px-4 py-2 text-sm font-serif uppercase tracking-[0.12em] text-[rgba(200,168,75,0.9)] disabled:opacity-40 hover:bg-[rgba(200,168,75,0.2)] transition-colors"
        >
          <Save size={14} />
          {saving ? "Guardando..." : "Guardar XP"}
        </button>
        {saved && <span className="text-xs font-serif text-[rgba(143,188,143,0.8)]">Guardado</span>}
      </div>
    </div>
  );
}
