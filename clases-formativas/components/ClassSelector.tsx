"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormativeClass, CLASS_LABELS, CLASS_ATTRIBUTES } from "@/clases-formativas/types";

const CLASSES: { id: FormativeClass; personaje: string; descripcion: string; icon: string }[] = [
  { id: "barbaro", personaje: "Sansón", descripcion: "Fuerza y determinación. Entrega sin dudar, resiste el error.", icon: "⚔️" },
  { id: "bardo", personaje: "David", descripcion: "Carisma y destreza. Comunica, colabora y destaca en lo artístico.", icon: "🎵" },
  { id: "clerigo", personaje: "Samuel", descripcion: "Sabiduría y vocación. Constante, reflexivo y guía del grupo.", icon: "✨" },
  { id: "paladin", personaje: "Moisés", descripcion: "Fuerza y carisma. Lidera con ejemplo y lleva al grupo adelante.", icon: "🛡️" },
  { id: "druida", personaje: "Noé", descripcion: "Inteligencia y sabiduría. Planifica, organiza y piensa antes de actuar.", icon: "🌿" },
  { id: "erudito", personaje: "Salomón", descripcion: "Inteligencia aplicada. Domina el conocimiento técnico y lo comunica con claridad.", icon: "📖" },
];

export default function ClassSelector({ email }: { email: string }) {
  const [selected, setSelected] = useState<FormativeClass | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="flex flex-col gap-6">
      {/* Grid de clases */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CLASSES.map((cls) => {
          const isSelected = selected === cls.id;
          return (
            <button
              key={cls.id}
              onClick={() => { setSelected(cls.id); setConfirming(false); }}
              className={`relative flex flex-col gap-3 rounded-xl border p-6 text-left transition-all ${
                isSelected
                  ? "border-[#c9a227] bg-[#c9a227]/10 shadow-[0_0_20px_rgba(201,162,39,0.2)]"
                  : "border-[#1e3320] bg-[#1a2e1c]/60 hover:border-[#8fbc8f]/40 hover:bg-[#1e3320]"
              }`}
            >
              <span className="text-3xl">{cls.icon}</span>
              <div>
                <p className={`font-serif text-lg font-bold ${isSelected ? "text-[#c9a227]" : "text-[#f5f0e8]"}`}>
                  {CLASS_LABELS[cls.id]}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#9aab8a] mt-0.5">
                  {cls.personaje}
                </p>
              </div>
              <p className="text-xs text-[#9aab8a] leading-relaxed">{cls.descripcion}</p>
              <div className="flex gap-2 flex-wrap mt-1">
                {CLASS_ATTRIBUTES[cls.id].map((attr) => (
                  <span key={attr} className="text-[9px] uppercase tracking-wider bg-[#0d1a0f] text-[#8fbc8f] px-2 py-0.5 rounded">
                    {attr}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirmación */}
      {selected && !confirming && (
        <div className="flex justify-center">
          <button
            onClick={() => setConfirming(true)}
            className="bg-[#c9a227] hover:bg-[#b8911f] text-[#0d1a0f] font-semibold text-sm py-3 px-10 rounded-lg transition-colors"
          >
            Elegir {CLASS_LABELS[selected]}
          </button>
        </div>
      )}

      {confirming && (
        <div className="bg-[#1a2e1c] border border-[#c9a227]/30 rounded-xl p-6 flex flex-col gap-4 items-center text-center">
          <p className="text-[#f5f0e8] font-serif text-lg">
            ¿Confirmás que tu clase es <span className="text-[#c9a227]">{CLASS_LABELS[selected!]}</span>?
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
