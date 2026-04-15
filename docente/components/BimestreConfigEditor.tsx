"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { BimestreConfigEntry, XpConfigEntry } from "@/lib/supabase/config";

const BIMESTRES = ["B1", "B2", "B3", "B4"];

interface Props {
  courseId: string;
  initialEntries: BimestreConfigEntry[];
  xpConfig: XpConfigEntry[];
}

function emptyEntry(courseId: string, bimestre: string): BimestreConfigEntry {
  return { course_id: courseId, bimestre, start_date: "", end_date: "", task_counts: {} };
}

export default function BimestreConfigEditor({ courseId, initialEntries, xpConfig }: Props) {
  const [entries, setEntries] = useState<BimestreConfigEntry[]>(
    BIMESTRES.map(
      (b) => initialEntries.find((e) => e.bimestre === b) ?? emptyEntry(courseId, b)
    )
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateDate(index: number, field: "start_date" | "end_date", value: string) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
    setSaved(false);
  }

  function updateTaskCount(index: number, tipo: string, value: string) {
    const n = value === "" ? 0 : Math.max(0, Number(value));
    setEntries((prev) =>
      prev.map((e, i) =>
        i === index
          ? { ...e, task_counts: { ...(e.task_counts ?? {}), [tipo]: n } }
          : e
      )
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/config/${courseId}/bimestres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entries.filter((e) => e.start_date && e.end_date)),
    });
    setSaved(res.ok);
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-[#1e3320]">
        <table className="w-full text-sm">
          <thead className="text-left text-xs font-serif">
            <tr>
              <th className="px-4 py-3">Bimestre</th>
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Fin</th>
              {xpConfig.map((x) => (
                <th key={x.tipo} className="px-4 py-3">
                  {x.label || x.tipo}
                  <span className="ml-1 text-[#9aab8a]/50">(cant.)</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3320] bg-[#0d1a0f]">
            {entries.map((entry, i) => (
              <tr key={entry.bimestre}>
                <td className="px-4 py-3 font-medium text-[#c9a227]">{entry.bimestre}</td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={entry.start_date}
                    onChange={(e) => updateDate(i, "start_date", e.target.value)}
                    className="rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={entry.end_date}
                    onChange={(e) => updateDate(i, "end_date", e.target.value)}
                    className="rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                  />
                </td>
                {xpConfig.map((x) => (
                  <td key={x.tipo} className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={entry.task_counts?.[x.tipo] ?? ""}
                      onChange={(e) => updateTaskCount(i, x.tipo, e.target.value)}
                      placeholder="0"
                      className="w-16 rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-center text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                    />
                  </td>
                ))}
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
          {saving ? "Guardando..." : "Guardar Bimestres"}
        </button>
        {saved && <span className="text-xs text-[#8fbc8f]">Guardado</span>}
      </div>
    </div>
  );
}
