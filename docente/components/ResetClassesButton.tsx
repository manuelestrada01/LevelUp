"use client";

import { useState } from "react";
import { RotateCcw, AlertTriangle, X } from "lucide-react";

interface Props {
  courseId?: string;
  label?: string;
}

export default function ResetClassesButton({ courseId, label }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/reset-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al reiniciar");
      setResult({ count: data.count });
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setOpen(true); setResult(null); setError(null); }}
          className="flex items-center gap-2 rounded-lg border border-[#c9a227]/40 px-4 py-2 text-sm text-[#c9a227] hover:bg-[#c9a227]/10 transition-colors"
        >
          <RotateCcw size={14} />
          {label ?? "Reiniciar clases formativas"}
        </button>
        {result !== null && (
          <span className="text-xs text-[#8fbc8f]">
            {result.count === 0
              ? "No había clases asignadas."
              : `${result.count} alumno${result.count !== 1 ? "s" : ""} reiniciado${result.count !== 1 ? "s" : ""}.`}
          </span>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border border-[#1e3320] bg-[#0d1a0f] p-6 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-[#9aab8a] hover:text-[#f5f0e8]"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-[#c9a227]" />
              <div>
                <h2 className="font-serif text-lg text-[#f5f0e8]">
                  Reiniciar clases formativas
                </h2>
                <p className="mt-2 text-sm text-[#9aab8a]">
                  {courseId
                    ? "Esto eliminará la clase formativa activa de todos los alumnos de este curso. Cada alumno deberá elegir nuevamente."
                    : "Esto eliminará la clase formativa activa de todos los alumnos del sistema. Cada alumno deberá elegir nuevamente."}
                </p>
                <p className="mt-1 text-sm text-[#9aab8a]">
                  El historial de clases anteriores se conserva.
                </p>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-[#c0392b]/10 px-3 py-2 text-sm text-[#c0392b]">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg px-4 py-2 text-sm text-[#9aab8a] hover:text-[#f5f0e8] disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-medium text-[#0d1a0f] hover:bg-[#c9a227]/80 disabled:opacity-50"
              >
                {loading ? (
                  <RotateCcw size={14} className="animate-spin" />
                ) : (
                  <RotateCcw size={14} />
                )}
                Confirmar reinicio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
