interface Props {
  total: number;
  completadas: number;
  xpTotal: number;
  nivel: number;
  strikesActivos: number;
  bimestre: string;
}

export default function ProgresoSidebar({
  total,
  completadas,
  xpTotal,
  nivel,
  strikesActivos,
  bimestre,
}: Props) {
  const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return (
    <div className="bg-[#1a2e1c]/60 backdrop-blur-md p-6 rounded-lg border border-[#424842]/20 flex flex-col gap-6">
      {/* Barra de progreso */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-widest text-[#c9a227]">
            Progreso {bimestre}
          </span>
          <span className="font-serif italic text-[#c9a227] text-lg">{pct}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#243a25] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#cabff9] to-[#c9a227] shadow-[0_0_10px_rgba(201,162,39,0.4)] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-[#9aab8a] mt-2">
          {completadas} de {total} misiones completadas
        </p>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#424842]/20">
        <div className="text-center">
          <p className="font-serif text-xl text-[#c9a227]">
            {xpTotal.toLocaleString("es-AR")}
          </p>
          <p className="text-[9px] uppercase tracking-widest text-[#9aab8a] mt-0.5">XP</p>
        </div>
        <div className="text-center">
          <p className="font-serif text-xl text-[#8fbc8f]">{nivel}</p>
          <p className="text-[9px] uppercase tracking-widest text-[#9aab8a] mt-0.5">Nivel</p>
        </div>
        <div className="text-center">
          <p
            className={`font-serif text-xl ${
              strikesActivos >= 3
                ? "text-[#c0392b]"
                : strikesActivos > 0
                ? "text-[#c9a227]"
                : "text-[#8fbc8f]"
            }`}
          >
            {strikesActivos}
          </p>
          <p className="text-[9px] uppercase tracking-widest text-[#9aab8a] mt-0.5">Strikes</p>
        </div>
      </div>
    </div>
  );
}
