import { Lamina, ProductionType } from "@/laminas/types";
import LaminasList from "@/laminas/components/LaminasList";

const MOCK_LAMINAS: Lamina[] = [
  {
    id: "1",
    productionType: "A4",
    title: "Lámina A4 — Semana 1",
    dueDate: new Date("2026-03-07"),
    submittedAt: new Date("2026-03-06"),
    status: "aprobada",
    xpEarned: 570,
  },
  {
    id: "2",
    productionType: "CAL",
    title: "Caligrafía — Semana 1",
    dueDate: new Date("2026-03-07"),
    submittedAt: new Date("2026-03-07"),
    status: "entregada",
    xpEarned: 300,
  },
  {
    id: "3",
    productionType: "A4",
    title: "Lámina A4 — Semana 2",
    dueDate: new Date("2026-03-14"),
    submittedAt: new Date("2026-03-14"),
    status: "entregada",
    xpEarned: 450,
  },
  {
    id: "4",
    productionType: "CAL",
    title: "Caligrafía — Semana 2",
    dueDate: new Date("2026-03-14"),
    submittedAt: new Date("2026-03-16"),
    status: "tardía",
    xpEarned: 450,
    strikeAdded: true,
  },
  {
    id: "5",
    productionType: "A3",
    title: "Lámina A3 — Producción Final",
    dueDate: new Date("2026-03-21"),
    status: "no_entregada",
  },
  {
    id: "6",
    productionType: "A4",
    title: "Lámina A4 — Semana 3",
    dueDate: new Date("2026-03-21"),
    status: "no_entregada",
  },
];

export default function LaminasPage() {
  return (
    <div className="w-full px-6 py-6 flex flex-col gap-8">
      <div>
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
          Registro de Producción
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#f5f0e8]">
          Láminas & Entregas
        </h1>
        <p className="mt-2 text-sm text-[#9aab8a] max-w-lg">
          Historial de todas tus entregas del ciclo lectivo. El estado de cada producción determina tu XP y tu nivel de strikes activos.
        </p>
      </div>

      <LaminasList laminas={MOCK_LAMINAS} />
    </div>
  );
}
