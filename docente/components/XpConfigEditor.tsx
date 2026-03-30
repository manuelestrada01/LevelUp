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
      <div className="overflow-hidden rounded-xl border border-[#1e3320]">
        <table className="w-full text-sm">
          <thead className="bg-[#1a2e1c] text-left text-xs text-[#9aab8a]">
            <tr>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Etiqueta</th>
              <th className="px-4 py-3">XP Base</th>
              <th className="px-4 py-3">Bonus Temprana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3320] bg-[#0d1a0f]">
            {entries.map((entry, i) => (
              <tr key={entry.tipo}>
                <td className="px-4 py-3 font-mono text-[#c9a227]">{entry.tipo}</td>
                <td className="px-4 py-3">
                  <input
                    value={entry.label}
                    onChange={(e) => update(i, "label", e.target.value)}
                    className="rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227] w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={entry.xp_base}
                    onChange={(e) => update(i, "xp_base", parseInt(e.target.value) || 0)}
                    className="w-20 rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={entry.xp_early}
                    onChange={(e) => update(i, "xp_early", parseInt(e.target.value) || 0)}
                    className="w-20 rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
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
          className="flex items-center gap-2 rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-medium text-[#0d1a0f] disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Guardando..." : "Guardar XP"}
        </button>
        {saved && <span className="text-xs text-[#8fbc8f]">Guardado</span>}
      </div>
    </div>
  );
}
