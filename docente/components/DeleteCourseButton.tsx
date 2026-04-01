"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, TriangleAlert, X } from "lucide-react";

interface Props {
  courseId: string;
  courseName: string;
}

export default function DeleteCourseButton({ courseId, courseName }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleOpen() {
    setStep(1);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        title="Eliminar curso del visor"
        className="rounded p-1 text-[#9aab8a] transition-colors hover:bg-[#0d1a0f] hover:text-[#c0392b]"
      >
        <Trash2 size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-[#1e3320] bg-[#0d1a0f] p-6 shadow-xl">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2 text-[#c0392b]">
                <TriangleAlert size={18} />
                <span className="font-serif text-base font-bold text-[#f5f0e8]">
                  Eliminar curso del visor
                </span>
              </div>
              <button onClick={handleClose} className="text-[#9aab8a] hover:text-[#f5f0e8]">
                <X size={16} />
              </button>
            </div>

            {step === 1 && (
              <>
                <p className="text-sm text-[#9aab8a] leading-relaxed mb-2">
                  Vas a eliminar{" "}
                  <span className="text-[#f5f0e8] font-medium">{courseName}</span>{" "}
                  del Visor Académico.
                </p>
                <ul className="text-xs text-[#9aab8a] leading-relaxed space-y-1 mb-5 list-disc list-inside">
                  <li>El curso dejará de verse en el panel docente y en el visor del alumno.</li>
                  <li>Los datos existentes (XP, strikes, entregas) quedan guardados en la base de datos.</li>
                  <li>El curso en Google Classroom no se modifica.</li>
                  <li>Si lo necesitás de vuelta, podés volver a registrarlo desde Classroom.</li>
                </ul>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className="px-5 py-2 text-sm border border-[#1e3320] text-[#9aab8a] rounded-lg hover:bg-[#1a2e1c] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2 text-sm bg-[#c0392b]/20 border border-[#c0392b]/40 text-[#c0392b] rounded-lg hover:bg-[#c0392b]/30 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-[#f5f0e8] mb-1">
                  ¿Confirmás que querés eliminar este curso del visor?
                </p>
                <p className="text-xs text-[#9aab8a] mb-6">Esta acción se puede revertir volviendo a registrar el curso.</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2 text-sm border border-[#1e3320] text-[#9aab8a] rounded-lg hover:bg-[#1a2e1c] transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-5 py-2 text-sm bg-[#c0392b] text-white font-semibold rounded-lg hover:bg-[#a93226] transition-colors disabled:opacity-50"
                  >
                    {loading ? "Eliminando..." : "Eliminar curso"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
