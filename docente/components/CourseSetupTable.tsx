"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

const TIPOS = ["A4", "A3", "CAL", "MAQ", "CAD", "EVA", "EVT"] as const;

interface Item {
  classroom_coursework_id: string;
  title: string;
  tipo: string | null;
}

interface Props {
  courseId: string;
  items: Item[];
}

export default function CourseSetupTable({ courseId, items }: Props) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Item[]>(items);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function setTipo(id: string, tipo: string) {
    setAssignments((prev) =>
      prev.map((item) =>
        item.classroom_coursework_id === id ? { ...item, tipo } : item
      )
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const configured = assignments.filter((a) => a.tipo);
    const res = await fetch(`/api/courses/${courseId}/setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        configured.map((a) => ({
          classroom_coursework_id: a.classroom_coursework_id,
          tipo: a.tipo,
          name: a.title,
        }))
      ),
    });
    setSaved(res.ok);
    setSaving(false);
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-[#9aab8a]">
        No hay tareas en este curso de Classroom, o el curso no tiene asignaciones creadas.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-[#1e3320]">
        <table className="w-full text-sm">
          <thead className="bg-[#1a2e1c] text-left text-xs text-[#9aab8a]">
            <tr>
              <th className="px-4 py-3">Tarea en Classroom</th>
              <th className="px-4 py-3">Tipo de Producción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3320] bg-[#0d1a0f]">
            {assignments.map((item) => (
              <tr key={item.classroom_coursework_id} className="hover:bg-[#1a2e1c]">
                <td className="px-4 py-3 text-[#f5f0e8]">{item.title}</td>
                <td className="px-4 py-3">
                  <select
                    value={item.tipo ?? ""}
                    onChange={(e) => setTipo(item.classroom_coursework_id, e.target.value)}
                    className="rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                  >
                    <option value="">Sin asignar</option>
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
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
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
        {saved && (
          <span className="text-xs text-[#8fbc8f]">Configuración guardada</span>
        )}
      </div>
    </div>
  );
}
