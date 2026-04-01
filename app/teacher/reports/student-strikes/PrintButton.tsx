"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";

export default function PrintButton() {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-lg border border-[#1e3320] px-4 py-2 text-sm text-[#9aab8a] transition-colors hover:border-[#c9a227]/40 hover:text-[#c9a227]"
    >
      <Printer size={14} />
      Imprimir
    </button>
  );
}
