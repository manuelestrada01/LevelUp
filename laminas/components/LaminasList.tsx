import { Lamina, LaminaStatus } from "@/laminas/types";

interface LaminasListProps {
  laminas: Lamina[];
  activeBimestre: string;
}

const STATUS_CONFIG: Record<LaminaStatus, { label: string; color: string; bg: string }> = {
  entregada:    { label: "Entregada",    color: "text-[#9aab8a]",    bg: "bg-[#1e3320] border-[#1e3320]" },
  tardía:       { label: "Tardía",       color: "text-[#c9a227]",    bg: "bg-[#c9a227]/10 border-[#c9a227]/20" },
  pendiente:    { label: "Pendiente",    color: "text-[#9aab8a]",    bg: "bg-[#1a2e1c] border-[#1e3320]" },
  no_entregada: { label: "No entregada", color: "text-[#9aab8a]/40", bg: "bg-[#1a2e1c] border-[#1e3320]" },
};

const TYPE_COLORS: Record<string, string> = {
  A4:  "text-[#c9a227] bg-[#c9a227]/15",
  A3:  "text-[#8fbc8f] bg-[#8fbc8f]/15",
  CAL: "text-[#9aab8a] bg-[#1e3320]",
  CAD: "text-[#9aab8a] bg-[#1e3320]",
  EVA: "text-[#c0392b] bg-[#c0392b]/10",
  EVT: "text-[#c9a227] bg-[#c9a227]/10",
};

function typeColor(tipo: string): string {
  return TYPE_COLORS[tipo] ?? "text-[#9aab8a] bg-[#1e3320]";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function BimestreTable({ laminas }: { laminas: Lamina[] }) {
  return (
    <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] overflow-hidden">
      <div className="grid grid-cols-[72px_1fr_110px_110px_110px_72px] gap-4 border-b border-[#1e3320] px-5 py-3">
        {["Tipo", "Tarea", "Vencimiento", "Entregado", "Estado", "XP"].map((col) => (
          <p key={col} className="text-[10px] font-semibold uppercase tracking-wider text-[#9aab8a]/60">
            {col}
          </p>
        ))}
      </div>
      <div className="flex flex-col divide-y divide-[#1e3320]">
        {laminas.map((lamina) => {
          const status = STATUS_CONFIG[lamina.status];
          const isPending = lamina.status === "no_entregada" || lamina.status === "pendiente";
          return (
            <div
              key={lamina.id}
              className={`grid grid-cols-[72px_1fr_110px_110px_110px_72px] gap-4 items-center px-5 py-4 ${
                isPending ? "opacity-50" : ""
              }`}
            >
              <span className={`w-fit rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeColor(lamina.productionType)}`}>
                {lamina.productionType}
              </span>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[#f5f0e8] leading-tight truncate">
                  {lamina.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {lamina.strikeAdded && (
                    <p className="text-[10px] text-[#c0392b] uppercase tracking-wider">+1 Strike</p>
                  )}
                  {lamina.isEarly && (
                    <p className="text-[10px] text-[#8fbc8f] uppercase tracking-wider">Anticipada</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#9aab8a]">
                {lamina.dueDate ? formatDate(lamina.dueDate) : "—"}
              </p>

              <p className="text-xs text-[#9aab8a]">
                {lamina.submittedAt ? formatDate(lamina.submittedAt) : "—"}
              </p>

              <span className={`w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${status.bg} ${status.color}`}>
                {status.label}
              </span>

              <p className={`text-sm font-bold ${lamina.xpEarned ? "text-[#8fbc8f]" : "text-[#9aab8a]/30"}`}>
                {lamina.xpEarned ? `+${lamina.xpEarned}` : "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LaminasList({ laminas, activeBimestre }: LaminasListProps) {
  const active = laminas.filter((l) => l.bimestre === activeBimestre);
  const previous = laminas.filter((l) => l.bimestre !== activeBimestre);

  const previousBimestres = [...new Set(previous.map((l) => l.bimestre))].sort();

  const totalXp = laminas.reduce((sum, l) => sum + (l.xpEarned ?? 0), 0);
  const strikesGenerados = laminas.filter((l) => l.strikeAdded).length;
  const pendientes = laminas.filter((l) => l.status === "no_entregada").length;

  return (
    <div className="flex flex-col gap-8">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "XP acumulada", value: totalXp.toLocaleString("es-AR") + " XP", color: "text-[#c9a227]" },
          { label: "Strikes generados", value: String(strikesGenerados), color: "text-[#c0392b]" },
          { label: "Pendientes", value: String(pendientes), color: "text-[#9aab8a]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]">{label}</p>
            <p className={`mt-1 font-serif text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bimestre activo */}
      {active.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-widest text-[#c9a227] font-semibold">
              {activeBimestre}
            </p>
            <span className="rounded-full bg-[#c9a227]/15 border border-[#c9a227]/30 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#c9a227]">
              Activo
            </span>
          </div>
          <BimestreTable laminas={active} />
        </section>
      )}

      {/* Bimestres anteriores */}
      {previousBimestres.map((bim) => {
        const rows = previous.filter((l) => l.bimestre === bim);
        return (
          <section key={bim} className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-[#9aab8a]/60 font-semibold">
              {bim}
            </p>
            <BimestreTable laminas={rows} />
          </section>
        );
      })}

      {laminas.length === 0 && (
        <p className="text-sm text-[#9aab8a] text-center py-12">
          Todavía no hay entregas registradas.
        </p>
      )}
    </div>
  );
}
