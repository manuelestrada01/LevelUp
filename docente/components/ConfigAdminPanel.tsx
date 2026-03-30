import XpConfigEditor from "./XpConfigEditor";
import BimestreConfigEditor from "./BimestreConfigEditor";
import type { XpConfigEntry, BimestreConfigEntry } from "@/lib/supabase/config";

interface Props {
  courseId: string;
  xpConfig: XpConfigEntry[];
  bimestreConfig: BimestreConfigEntry[];
}

export default function ConfigAdminPanel({ courseId, xpConfig, bimestreConfig }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="mb-3 font-serif text-lg text-[#f5f0e8]">XP por Tipo de Producción</h3>
        <p className="mb-4 text-xs text-[#9aab8a]">
          Asigná XP base y bonus por entrega temprana para cada tipo de producción de este curso.
          Dejá vacío para usar los valores globales.
        </p>
        <XpConfigEditor courseId={courseId} initialEntries={xpConfig} />
      </section>

      <div className="border-t border-[#1e3320]" />

      <section>
        <h3 className="mb-3 font-serif text-lg text-[#f5f0e8]">Fechas de Bimestre</h3>
        <p className="mb-4 text-xs text-[#9aab8a]">
          El sistema detecta el bimestre activo en tiempo real según la fecha y hora actual.
        </p>
        <BimestreConfigEditor courseId={courseId} initialEntries={bimestreConfig} />
      </section>
    </div>
  );
}
