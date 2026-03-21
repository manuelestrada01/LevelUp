import { Badge } from "@/distinciones/types";
import BadgesGrid from "@/distinciones/components/BadgesGrid";

const MOCK_EARNED: Badge[] = [
  {
    id: "primera-entrega",
    name: "Primera Entrega",
    description: "Completaste tu primera lámina en término.",
    earnedAt: new Date("2026-03-01"),
    icon: "📜",
  },
  {
    id: "racha-3",
    name: "Racha de 3",
    description: "Tres entregas consecutivas antes del plazo.",
    earnedAt: new Date("2026-03-10"),
    icon: "🔥",
  },
  {
    id: "silencioso",
    name: "Artesano Silencioso",
    description: "Entregaste 24hs antes en 5 oportunidades.",
    earnedAt: new Date("2026-03-15"),
    icon: "🌿",
  },
  {
    id: "calidad",
    name: "Trazo Destacado",
    description: "Recibiste bonus de calidad técnica por primera vez.",
    earnedAt: new Date("2026-03-18"),
    icon: "⭐",
  },
];

const MOCK_LOCKED = [
  { id: "nivel-30", name: "Maestro del Trazo", description: "Alcanza el nivel 30.", icon: "👑" },
  { id: "sin-strikes", name: "Camino Limpio", description: "Completa un bimestre sin strikes.", icon: "🛡" },
  { id: "racha-10", name: "Inquebrantable", description: "Diez entregas consecutivas en término.", icon: "⚡" },
  { id: "colaborador", name: "Espíritu del Gremio", description: "Participa en una misión de intercurso.", icon: "🤝" },
  { id: "cad-maestro", name: "Dominio CAD", description: "Aprueba una evaluación CAD con bonus de calidad.", icon: "📐" },
  { id: "evento", name: "Presencia en el Nexo", description: "Participa en un evento especial.", icon: "✦" },
];

export default function DistincionesPage() {
  return (
    <div className="w-full px-6 py-6 flex flex-col gap-8">
      {/* Page header */}
      <div>
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
          Logros del Gremio
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#f5f0e8]">
          Distinciones
        </h1>
        <p className="mt-2 text-sm text-[#9aab8a] max-w-lg">
          Insignias obtenidas a lo largo de tu recorrido. Cada distinción refleja un patrón de constancia, calidad o participación sostenida.
        </p>
      </div>

      <BadgesGrid earned={MOCK_EARNED} locked={MOCK_LOCKED} />
    </div>
  );
}
