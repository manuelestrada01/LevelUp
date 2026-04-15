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
      <div className="chronicle-stone relative overflow-x-auto overflow-hidden">
        <table className="w-full text-sm">
          <thead
            className="text-left text-[11px] font-serif uppercase tracking-[0.15em]"
            style={{ background: "rgba(160,125,55,0.07)", borderBottom: "1px solid rgba(160,125,55,0.18)" }}
          >
            <tr>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Bimestre</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Inicio</th>
              <th className="px-4 py-3 text-[rgba(160,125,55,0.65)]">Fin</th>
              {xpConfig.map((x) => (
                <th key={x.tipo} className="px-4 py-3 text-[rgba(160,125,55,0.65)]">
                  {x.label || x.tipo}
                  <span className="ml-1 text-[rgba(160,125,55,0.4)]">(cant.)</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(160,125,55,0.1)]">
            {entries.map((entry, i) => (
              <tr key={entry.bimestre} className="transition-colors hover:bg-[rgba(160,125,55,0.03)]">
                <td className="px-4 py-3 font-mono text-sm font-medium text-[rgba(200,168,75,0.85)]">
                  {entry.bimestre}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={entry.start_date}
                    onChange={(e) => updateDate(i, "start_date", e.target.value)}
                    className="border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={entry.end_date}
                    onChange={(e) => updateDate(i, "end_date", e.target.value)}
                    className="border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
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
                      className="w-16 border border-[rgba(160,125,55,0.22)] bg-[rgba(160,125,55,0.04)] px-2 py-1 text-center text-xs font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.5)]"
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
          className="flex items-center gap-2 border border-[rgba(200,168,75,0.5)] bg-[rgba(200,168,75,0.12)] px-4 py-2 text-[11px] font-serif uppercase tracking-[0.12em] text-[rgba(200,168,75,0.9)] transition-colors hover:bg-[rgba(200,168,75,0.2)] disabled:opacity-40"
        >
          <Save size={13} />
          {saving ? "Guardando..." : "Guardar Bimestres"}
        </button>
        {saved && <span className="text-xs font-serif text-[rgba(143,188,143,0.8)]">Guardado</span>}
      </div>
    </div>
  );
}
