"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { classroom_v1 } from "googleapis";

interface Props {
  availableCourses: classroom_v1.Schema$Course[];
}

export default function AddCourseForm({ availableCourses }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroom_id: selectedId, year: 1 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al agregar curso");
      }
      const course = await res.json();
      router.push(`/teacher/courses/${course.id}/setup`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="mb-1 block text-xs text-[#9aab8a]">Curso de Classroom</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          required
          className="w-full rounded-lg border border-[#1e3320] bg-[#1a2e1c] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
        >
          <option value="">Seleccioná un curso...</option>
          {availableCourses.map((c) => (
            <option key={c.id} value={c.id!}>
              {c.name} {c.section ? `— ${c.section}` : ""}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs text-[#c0392b]">{error}</p>}

      <button
        type="submit"
        disabled={loading || !selectedId}
        className="rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-medium text-[#0d1a0f] transition-opacity disabled:opacity-50"
      >
        {loading ? "Registrando..." : "Registrar curso"}
      </button>
    </form>
  );
}
