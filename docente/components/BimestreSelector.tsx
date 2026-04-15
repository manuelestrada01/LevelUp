"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const BIMESTRES = ["B1", "B2", "B3", "B4"];

interface Props {
  currentBimestre: string;
  activeBimestre: string;
}

export default function BimestreSelector({ currentBimestre, activeBimestre }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function selectBimestre(b: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (b === null) {
      params.delete("bimestre");
    } else {
      params.set("bimestre", b);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const isActivo = !searchParams.has("bimestre");

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] font-serif uppercase tracking-[0.22em] text-[rgba(160,125,55,0.55)]">Bimestre:</span>
      {BIMESTRES.map((b) => {
        const isSelected = !isActivo && currentBimestre === b;
        const isActiveB = b === activeBimestre;
        return (
          <button
            key={b}
            onClick={() => selectBimestre(b)}
            className={`border px-3 py-1 text-[11px] font-serif uppercase tracking-[0.15em] transition-colors ${
              isSelected
                ? "border-[rgba(200,168,75,0.6)] bg-[rgba(200,168,75,0.15)] text-[rgba(200,168,75,0.95)]"
                : isActiveB
                ? "border-[rgba(200,168,75,0.35)] text-[rgba(160,125,55,0.7)] hover:border-[rgba(200,168,75,0.55)] hover:text-[rgba(200,168,75,0.9)]"
                : "border-[rgba(160,125,55,0.2)] text-[rgba(160,125,55,0.45)] hover:border-[rgba(160,125,55,0.38)] hover:text-[rgba(200,168,75,0.75)]"
            }`}
          >
            {b}
            {isActiveB && !isSelected && (
              <span className="ml-1 text-[8px] text-[rgba(200,168,75,0.7)]">●</span>
            )}
          </button>
        );
      })}
      <button
        onClick={() => selectBimestre(null)}
        className={`border px-3 py-1 text-[11px] font-serif uppercase tracking-[0.15em] transition-colors ${
          isActivo
            ? "border-[rgba(200,168,75,0.6)] bg-[rgba(200,168,75,0.15)] text-[rgba(200,168,75,0.95)]"
            : "border-[rgba(160,125,55,0.2)] text-[rgba(160,125,55,0.45)] hover:border-[rgba(160,125,55,0.38)] hover:text-[rgba(200,168,75,0.75)]"
        }`}
      >
        Activo
      </button>
    </div>
  );
}
