import { Mision } from "@/misiones/types";
import MisionesGrid from "@/misiones/components/MisionesGrid";

const MOCK_MISIONES: Mision[] = [
  {
    id: "1",
    type: "intracurso",
    title: "Lámina perfecta",
    description: "Entregá una lámina A4 con bonus de calidad técnica esta semana.",
    xpReward: 200,
    status: "activa",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
  },
  {
    id: "2",
    type: "intercurso",
    title: "Comparte tu proceso",
    description: "Mostrá tu lámina en proceso a un compañero de otro año y recibí feedback.",
    xpReward: 350,
    status: "activa",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 72),
  },
  {
    id: "3",
    type: "comunidad",
    title: "Silencio productivo",
    description: "Entregá 3 láminas consecutivas con XP silenciosa (24hs antes del plazo).",
    xpReward: 500,
    status: "activa",
  },
  {
    id: "4",
    type: "interarea",
    title: "Nexo de Saberes",
    description: "Participá en el encuentro interárea junto al espacio de Lengua.",
    xpReward: 800,
    status: "activa",
    expiresAt: new Date("2026-04-10"),
  },
  {
    id: "5",
    type: "intracurso",
    title: "Racha de 5",
    description: "Cinco entregas en término de forma consecutiva.",
    xpReward: 400,
    status: "completada",
    completedAt: new Date("2026-03-14"),
  },
];

export default function MisionesPage() {
  return (
    <div className="w-full px-6 py-6 flex flex-col gap-8">
      <div>
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
          Quests del Gremio
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#f5f0e8]">
          Misiones
        </h1>
        <p className="mt-2 text-sm text-[#9aab8a] max-w-lg">
          Desafíos activos que complementan tu recorrido. Cada misión completada aporta XP adicional y fortalece el espíritu del gremio.
        </p>
      </div>

      <MisionesGrid misiones={MOCK_MISIONES} />
    </div>
  );
}
