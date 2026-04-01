"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

export default function ClassSelector({
  email,
  classes,
}: {
  email: string;
  classes: FormativeClassEntry[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const selectedClass = classes.find((c) => c.slug === selected);

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/student/class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formativeClass: selected }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  if (classes.length === 0) {
    return (
      <p className="text-center text-[#9aab8a] text-sm">
        No hay clases formativas disponibles por el momento.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const isSelected = selected === cls.slug;
          return (
            <button
              key={cls.slug}
              onClick={() => { setSelected(cls.slug); setConfirming(false); }}
              className={`relative flex flex-col gap-3 rounded-xl border p-6 text-left transition-all ${
                isSelected
                  ? "border-[#c9a227] bg-[#c9a227]/10 shadow-[0_0_20px_rgba(201,162,39,0.2)]"
                  : "border-[#1e3320] bg-[#1a2e1c]/60 hover:border-[#8fbc8f]/40 hover:bg-[#1e3320]"
              }`}
            >
              <div>
                <p className={`font-serif text-lg font-bold ${isSelected ? "text-[#c9a227]" : "text-[#f5f0e8]"}`}>
                  {cls.title}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#9aab8a] mt-0.5">
                  {cls.inspiration}
                </p>
              </div>
              <p className="text-xs text-[#9aab8a] leading-relaxed">{cls.description}</p>
              <div className="flex gap-2 flex-wrap mt-1">
                {cls.attributes.map((attr) => (
                  <span key={attr} className="text-[9px] uppercase tracking-wider bg-[#0d1a0f] text-[#8fbc8f] px-2 py-0.5 rounded">
                    {attr}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selected && !confirming && (
        <div className="flex justify-center">
          <button
            onClick={() => setConfirming(true)}
            className="bg-[#c9a227] hover:bg-[#b8911f] text-[#0d1a0f] font-semibold text-sm py-3 px-10 rounded-lg transition-colors"
          >
            Elegir {selectedClass?.title}
          </button>
        </div>
      )}

      {confirming && (
        <div className="bg-[#1a2e1c] border border-[#c9a227]/30 rounded-xl p-6 flex flex-col gap-4 items-center text-center">
          <p className="text-[#f5f0e8] font-serif text-lg">
            ¿Confirmás que tu clase es{" "}
            <span className="text-[#c9a227]">{selectedClass?.title}</span>?
          </p>
          <p className="text-xs text-[#9aab8a]">Esta decisión no se puede cambiar.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirming(false)}
              className="px-6 py-2.5 text-sm border border-[#1e3320] text-[#9aab8a] rounded-lg hover:bg-[#1e3320] transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-6 py-2.5 text-sm bg-[#c9a227] text-[#0d1a0f] font-semibold rounded-lg hover:bg-[#b8911f] transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
