"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

const REASONS = [
  { value: "missing_materials", label: "No trajo los materiales de trabajo" },
  { value: "no_submission", label: "No entrega" },
  { value: "late_submission", label: "Entrega tardía" },
];

interface Props {
  courseId: string;
  studentEmail: string;
}

export default function ForceStrikeButton({ courseId, studentEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("no_submission");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/students/${encodeURIComponent(studentEmail)}/strike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId, reason }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Forzar strike"
        className="flex items-center gap-1 rounded border border-[#1e3320] px-2 py-0.5 text-xs text-[#9aab8a] transition-colors hover:border-[#c0392b]/40 hover:text-[#c0392b]"
      >
        <Plus size={10} />
        Strike
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-[#1e3320] bg-[#0d1a0f] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-base text-[#f5f0e8]">Forzar Strike</h3>
              <button onClick={() => setOpen(false)} className="text-[#9aab8a] hover:text-[#f5f0e8]">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {REASONS.map((r) => (
                  <label key={r.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="accent-[#c9a227]"
                    />
                    <span className="text-sm text-[#f5f0e8]">{r.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-[#1e3320] px-3 py-1.5 text-xs text-[#9aab8a] hover:text-[#f5f0e8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#c0392b] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Forzar strike"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
