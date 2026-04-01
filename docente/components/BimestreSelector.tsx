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
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#9aab8a]">Bimestre:</span>
      {BIMESTRES.map((b) => {
        const isSelected = !isActivo && currentBimestre === b;
        const isActiveB = b === activeBimestre;
        return (
          <button
            key={b}
            onClick={() => selectBimestre(b)}
            className={`rounded-md px-3 py-1 text-xs transition-colors ${
              isSelected
                ? "bg-[#c9a227] font-medium text-[#0d1a0f]"
                : `border text-[#9aab8a] hover:text-[#f5f0e8] ${
                    isActiveB ? "border-[#c9a227]/40" : "border-[#1e3320]"
                  } hover:border-[#c9a227]/40`
            }`}
          >
            {b}
            {isActiveB && !isSelected && (
              <span className="ml-1 text-[10px] text-[#c9a227]">●</span>
            )}
          </button>
        );
      })}
      <button
        onClick={() => selectBimestre(null)}
        className={`rounded-md px-3 py-1 text-xs transition-colors ${
          isActivo
            ? "bg-[#c9a227] font-medium text-[#0d1a0f]"
            : "border border-[#1e3320] text-[#9aab8a] hover:border-[#c9a227]/40 hover:text-[#f5f0e8]"
        }`}
      >
        Activo
      </button>
    </div>
  );
}
