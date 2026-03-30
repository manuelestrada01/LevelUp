"use client";

import { useState } from "react";
import { FormativeClass, CLASS_LABELS, CLASS_ATTRIBUTES } from "@/clases-formativas/types";
import { ArrowRight, Check } from "lucide-react";

interface ClassesSectionProps {
  activeClass: FormativeClass;
}

const CLASS_DESCRIPTIONS: Record<FormativeClass, string> = {
  barbaro: "Representa la fortaleza puesta al servicio de otros. Encarna la valentía y la resistencia para sostener el esfuerzo académico.",
  bardo: "Inspiración y comunicación. Quienes aportan entusiasmo, creatividad; recordando que la técnica también comunica.",
  clerigo: "Encarna la guía y el discernimiento. Busca el sentido profundo y sostiene el trabajo con responsabilidad ética.",
  paladin: "Sostiene principios aun cuando el camino es difícil. Liderazgo al servicio de otros con coherencia ética.",
  druida: "Comprende los procesos a largo plazo, actúa con previsión. Planifica y trabaja con paciencia técnica.",
  erudito: "Busca comprender antes de actuar. La verdadera sabiduría es discernir y tomar decisiones justas aplicadas a la técnica.",
};

const CLASS_MOTTOS: Record<FormativeClass, string> = {
  barbaro: "La fuerza es para servir",
  bardo: "Un canto de alabanza",
  clerigo: "Instruye en el camino",
  paladin: "Fe a prueba de fuego",
  druida: "Paciencia y fruto",
  erudito: "Conocimiento & Verdad",
};

const CLASS_ICONS: Record<FormativeClass, string> = {
  barbaro: "⚔",
  bardo: "♪",
  clerigo: "✦",
  paladin: "🛡",
  druida: "🌿",
  erudito: "📖",
};

const ALL_CLASSES: FormativeClass[] = [
  "barbaro",
  "bardo",
  "clerigo",
  "paladin",
  "druida",
  "erudito",
];

const ATTRIBUTE_LABELS: Record<string, string> = {
  Fuerza: "FUERZA",
  Constitución: "VIGOR",
  Carisma: "CARISMA",
  Destreza: "ARTE",
  Sabiduría: "SABID.",
  Inteligencia: "INTELIG.",
};

export default function ClassesSection({ activeClass }: ClassesSectionProps) {
  const [selectedClass, setSelectedClass] = useState<FormativeClass | null>(null);

  return (
    <section className="pb-8">
      {/* Section header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
            Especialización de Gremio
          </p>
          <h2 className="font-serif text-2xl font-bold text-[#f5f0e8]">
            Clases Formativas
          </h2>
        </div>
        <p className="max-w-[260px] text-right text-[10px] italic leading-relaxed text-[#9aab8a]/70">
          "Porque muchos son llamados, más pocos son los escogidos."
          <br />
          <span className="not-italic">— Arquetipos del Conocimiento</span>
        </p>
      </div>

      {/* Cards horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {ALL_CLASSES.map((cls) => {
          const isActive = cls === activeClass;
          const isSelected = cls === selectedClass;
          const [attr1, attr2] = CLASS_ATTRIBUTES[cls];

          return (
            <div
              key={cls}
              onClick={() => setSelectedClass(isSelected ? null : cls)}
              className={`relative flex w-[220px] flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border p-4 transition-colors ${
                isSelected
                  ? "border-[#c9a227]/60 bg-[#c9a227]/10"
                  : "border-[#1e3320] bg-[#0F2411]"
              }`}
            >
              {/* Watermark icon */}
              <span
                className={`pointer-events-none absolute -right-3 -top-3 select-none text-[88px] leading-none ${
                  isSelected ? "opacity-10" : "opacity-[0.05]"
                }`}
              >
                {CLASS_ICONS[cls]}
              </span>

              {/* Attribute tags */}
              <div className="relative mb-3 flex flex-wrap gap-1">
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                    isSelected
                      ? "bg-[#c9a227]/20 text-[#c9a227]"
                      : "bg-[#1e3320] text-[#9aab8a]"
                  }`}
                >
                  {ATTRIBUTE_LABELS[attr1] ?? attr1}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                    isSelected
                      ? "bg-[#c9a227]/20 text-[#c9a227]"
                      : "bg-[#1e3320] text-[#9aab8a]"
                  }`}
                >
                  {ATTRIBUTE_LABELS[attr2] ?? attr2}
                </span>
              </div>

              {/* Icon + Name */}
              <div className="relative mb-2 flex items-center gap-2">
                <span
                  className={`text-xl leading-none ${
                    isSelected ? "text-[#c9a227]" : "text-[#9aab8a]/60"
                  }`}
                >
                  {CLASS_ICONS[cls]}
                </span>
                <h3
                  className={`font-serif text-base font-bold leading-tight ${
                    isSelected ? "text-[#c9a227] uppercase" : "text-[#f5f0e8]"
                  }`}
                >
                  {CLASS_LABELS[cls]}
                </h3>
              </div>

              {/* Description */}
              <p className="relative mb-3 flex-1 text-[11px] leading-relaxed text-[#9aab8a]">
                {CLASS_DESCRIPTIONS[cls]}
              </p>

              {/* Motto */}
              <p
                className={`relative mb-3 text-[9px] font-medium uppercase tracking-widest ${
                  isSelected ? "text-[#c9a227]/60" : "text-[#9aab8a]/40"
                }`}
              >
                "{CLASS_MOTTOS[cls]}"
              </p>

              {/* CTA */}
              <button
                className={`relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#c9a227]/20 text-[#c9a227] hover:bg-[#c9a227]/30"
                    : "bg-[#1e3320] text-[#9aab8a] hover:bg-[#243d26] hover:text-[#f5f0e8]"
                }`}
              >
                {isActive ? "Clase activa" : "Ver clase"}
                {isActive ? (
                  <Check size={12} strokeWidth={2.5} />
                ) : (
                  <ArrowRight size={12} strokeWidth={2} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
