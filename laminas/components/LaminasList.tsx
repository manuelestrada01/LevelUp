import { Lamina, LaminaStatus, ProductionType } from "@/laminas/types";

interface LaminasListProps {
  laminas: Lamina[];
}

const STATUS_CONFIG: Record<LaminaStatus, { label: string; color: string; bg: string }> = {
  aprobada:     { label: "Aprobada",      color: "text-[#8fbc8f]",   bg: "bg-[#8fbc8f]/10 border-[#8fbc8f]/20" },
  entregada:    { label: "Entregada",     color: "text-[#9aab8a]",   bg: "bg-[#1e3320] border-[#1e3320]" },
  tardía:       { label: "Tardía",        color: "text-[#c9a227]",   bg: "bg-[#c9a227]/10 border-[#c9a227]/20" },
  rechazada:    { label: "Rechazada",     color: "text-[#c0392b]",   bg: "bg-[#c0392b]/10 border-[#c0392b]/20" },
  no_entregada: { label: "No entregada",  color: "text-[#9aab8a]/40", bg: "bg-[#1a2e1c] border-[#1e3320]" },
};

const TYPE_CONFIG: Record<ProductionType, { label: string; color: string }> = {
  A4:  { label: "A4",  color: "text-[#c9a227] bg-[#c9a227]/15" },
  A3:  { label: "A3",  color: "text-[#8fbc8f] bg-[#8fbc8f]/15" },
  CAL: { label: "CAL", color: "text-[#9aab8a] bg-[#1e3320]" },
  CAD: { label: "CAD", color: "text-[#9aab8a] bg-[#1e3320]" },
  EVA: { label: "EVA", color: "text-[#c0392b] bg-[#c0392b]/10" },
  EVT: { label: "EVT", color: "text-[#c9a227] bg-[#c9a227]/10" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export default function LaminasList({ laminas }: LaminasListProps) {
  const totalXp = laminas.reduce((sum, l) => sum + (l.xpEarned ?? 0), 0);
  const strikes = laminas.filter((l) => l.strikeAdded).length;
  const pendientes = laminas.filter((l) => l.status === "no_entregada").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "XP acumulada", value: totalXp.toLocaleString("es-AR") + " XP", color: "text-[#c9a227]" },
          { label: "Strikes generados", value: String(strikes), color: "text-[#c0392b]" },
          { label: "Pendientes", value: String(pendientes), color: "text-[#9aab8a]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]">{label}</p>
            <p className={`mt-1 font-serif text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[80px_1fr_120px_120px_100px_80px] gap-4 border-b border-[#1e3320] px-5 py-3">
          {["Tipo", "Título", "Vencimiento", "Entregado", "Estado", "XP"].map((col) => (
            <p key={col} className="text-[10px] font-semibold uppercase tracking-wider text-[#9aab8a]/60">
              {col}
            </p>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-[#1e3320]">
          {laminas.map((lamina) => {
            const status = STATUS_CONFIG[lamina.status];
            const type = TYPE_CONFIG[lamina.productionType];
            const isPending = lamina.status === "no_entregada";

            return (
              <div
                key={lamina.id}
                className={`grid grid-cols-[80px_1fr_120px_120px_100px_80px] gap-4 items-center px-5 py-4 ${
                  isPending ? "opacity-50" : ""
                }`}
              >
                {/* Type */}
                <span className={`w-fit rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${type.color}`}>
                  {type.label}
                </span>

                {/* Title */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#f5f0e8] leading-tight truncate">
                    {lamina.title}
                  </p>
                  {lamina.strikeAdded && (
                    <p className="mt-0.5 text-[10px] text-[#c0392b] uppercase tracking-wider">
                      +1 Strike
                    </p>
                  )}
                </div>

                {/* Due date */}
                <p className="text-xs text-[#9aab8a]">{formatDate(lamina.dueDate)}</p>

                {/* Submitted */}
                <p className="text-xs text-[#9aab8a]">
                  {lamina.submittedAt ? formatDate(lamina.submittedAt) : "—"}
                </p>

                {/* Status */}
                <span className={`w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${status.bg} ${status.color}`}>
                  {status.label}
                </span>

                {/* XP */}
                <p className={`text-sm font-bold ${lamina.xpEarned ? "text-[#8fbc8f]" : "text-[#9aab8a]/30"}`}>
                  {lamina.xpEarned ? `+${lamina.xpEarned}` : "—"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
