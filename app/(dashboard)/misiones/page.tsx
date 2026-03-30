import { Mision } from "@/misiones/types";
import MisionesGrid from "@/misiones/components/MisionesGrid";
import EncargosSemanales from "@/misiones/components/EncargosSemanales";

const MOCK_MISIONES: Mision[] = [
  {
    id: "1",
    category: "gremio",
    type: "intracurso",
    title: "Lámina A3 – Perspectiva Axonométrica",
    description: "Representación técnica de un complejo estructural mediante proyecciones ortogonales.",
    xpReward: 1200,
    bonusXp: 300,
    status: "activa",
    icon: "architecture",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
  },
  {
    id: "2",
    category: "gremio",
    type: "intercurso",
    title: "Tratado de Geometría Descriptiva",
    description: "Investigación sobre la intersección de volúmenes en el espacio euclidiano.",
    xpReward: 1500,
    bonusXp: 500,
    status: "expirada",
    icon: "ink_pen",
  },
  {
    id: "5",
    category: "gremio",
    type: "intracurso",
    title: "Proyecto de Sombra y Luz – Renderizado Manual",
    description: "Ejercicio de representación tonal con escalas de grises.",
    xpReward: 950,
    status: "completada",
    completedAt: new Date("2026-03-14"),
  },
  {
    id: "6",
    category: "gremio",
    type: "intracurso",
    title: "Escalado Proporcional: Mobiliario Urbano",
    description: "Representación a escala de mobiliario según normas técnicas.",
    xpReward: 600,
    status: "completada",
    completedAt: new Date("2026-03-07"),
  },
  {
    id: "3",
    category: "encargo",
    type: "intracurso",
    title: "Caligrafía Técnica Semanal",
    description: "Práctica de rotulado DIN 17",
    xpReward: 400,
    status: "activa",
    icon: "architecture",
  },
  {
    id: "4",
    category: "encargo",
    type: "intracurso",
    title: "Lámina A4 de Clase",
    description: "Apuntes gráficos del seminario",
    xpReward: 450,
    status: "activa",
    icon: "description",
  },
  {
    id: "7",
    category: "encargo",
    type: "intracurso",
    title: "Estudio de Materiales",
    description: "Texturizado de maderas nobles",
    xpReward: 380,
    status: "activa",
    icon: "brush",
  },
];

const PROGRESO_BIMESTRE = 68;
const DIAS_RESTANTES = 14;

export default function MisionesPage() {
  const encargos = MOCK_MISIONES.filter((m) => m.category === "encargo");

  return (
    <div className="w-full px-12 py-12 min-h-screen">
      {/* Header */}
      <header className="mb-12 flex justify-between items-end gap-8">
        <div>
          <h1 className="font-serif text-5xl font-bold text-[#f5f0e8] tracking-tight mb-2">
            Tablón de Misiones
          </h1>
          <p className="text-[#8fbc8f]/70 text-lg max-w-xl">
            Desafíos activos y encomiendas del gremio para el ciclo académico actual.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="bg-[#1a2e1c]/60 backdrop-blur-md p-6 rounded-lg border-l-2 border-[#c9a227] w-80 shadow-xl shrink-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase tracking-widest text-[#c9a227]">
              Progreso del Bimestre
            </span>
            <span className="font-serif italic text-[#c9a227] text-lg">{PROGRESO_BIMESTRE}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#243a25] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#cabff9] to-[#c9a227] shadow-[0_0_10px_rgba(201,162,39,0.4)]"
              style={{ width: `${PROGRESO_BIMESTRE}%` }}
            />
          </div>
          <p className="text-[11px] text-[#9aab8a] mt-2 italic">
            Faltan {DIAS_RESTANTES} días para el cierre del ciclo.
          </p>
        </div>
      </header>

      {/* 12-col bento grid */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Misiones principales — 8 cols */}
        <section className="col-span-12 lg:col-span-8">
          <MisionesGrid misiones={MOCK_MISIONES} />
        </section>

        {/* Sidebar — 4 cols */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <EncargosSemanales encargos={encargos} />

          {/* Quote card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#785600]/40 to-[#1a2e1c] p-6 rounded-lg border border-[#c9a227]/10">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-[#c9a227] mb-3 block">auto_awesome</span>
              <p className="font-serif italic text-[#c9a227] text-lg leading-snug">
                &ldquo;Un trazo firme en la lámina refleja un alma decidida en el bosque.&rdquo;
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#c9a227]/60 mt-4">
                Consejo de los Ancianos
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-10">
              <span
                className="material-symbols-outlined text-[120px] text-[#c9a227]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                history_edu
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* FAB */}
      <button className="fixed bottom-12 right-12 bg-[#c9a227] text-[#0d1a0f] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(201,162,39,0.5)] hover:scale-110 transition-transform z-50">
        <span className="material-symbols-outlined text-3xl">edit_square</span>
      </button>
    </div>
  );
}
