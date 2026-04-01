import { EarnedBadge, Badge } from "@/distinciones/types";

interface BadgesGridProps {
  earned: EarnedBadge[];
  locked: Badge[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

export default function BadgesGrid({ earned, locked }: BadgesGridProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Earned */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-serif text-xl font-bold text-[#f5f0e8]">Obtenidas</h2>
          <span className="rounded-full bg-[#c9a227]/20 px-2.5 py-0.5 text-xs font-semibold text-[#c9a227]">
            {earned.length}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {earned.map((badge) => (
            <div
              key={badge.id}
              className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-[#c9a227]/30 bg-[#1a2e1c] p-5"
            >
              {/* Background watermark */}
              <span className="pointer-events-none absolute -right-2 -top-2 select-none text-7xl leading-none opacity-[0.06]">
                {badge.icon}
              </span>

              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/15 text-2xl">
                  {badge.icon}
                </span>
                <div>
                  <p className="font-serif text-sm font-bold text-[#f5f0e8] leading-tight">
                    {badge.name}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#c9a227]/70">
                    Obtenida
                  </p>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-[#9aab8a]">
                {badge.description}
              </p>

              <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]/50">
                {formatDate(badge.earnedAt)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Locked */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-serif text-xl font-bold text-[#f5f0e8]/40">Por desbloquear</h2>
          <span className="rounded-full bg-[#1e3320] px-2.5 py-0.5 text-xs font-semibold text-[#9aab8a]/50">
            {locked.length}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {locked.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col gap-3 rounded-xl border border-[#1e3320] bg-[#1a2e1c]/60 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1e3320] text-2xl grayscale opacity-30">
                  {badge.icon}
                </span>
                <div>
                  <p className="font-serif text-sm font-bold text-[#f5f0e8]/30 leading-tight">
                    {badge.name}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#9aab8a]/30">
                    Bloqueada
                  </p>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-[#9aab8a]/40">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
