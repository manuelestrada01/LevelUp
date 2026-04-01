import XpConfigEditor from "./XpConfigEditor";
import BimestreConfigEditor from "./BimestreConfigEditor";
import TitleRangesEditor from "./TitleRangesEditor";
import XpProgressionCalculator from "./XpProgressionCalculator";
import ResetClassesButton from "./ResetClassesButton";
import type { XpConfigEntry, BimestreConfigEntry, TitleRange } from "@/lib/supabase/config";

interface Props {
  courseId: string;
  xpConfig: XpConfigEntry[];
  bimestreConfig: BimestreConfigEntry[];
  titleRanges: TitleRange[];
}

export default function ConfigAdminPanel({
  courseId,
  xpConfig,
  bimestreConfig,
  titleRanges,
}: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* Sección 1: XP por Tipo de Producción */}
      <section>
        <h3 className="mb-1 font-serif text-lg text-[#f5f0e8]">XP por Tipo de Producción</h3>
        <p className="mb-4 text-xs text-[#9aab8a]">
          Asigná XP base y bonus por entrega temprana para cada tipo de producción.
          Dejá vacío para usar los valores globales.
        </p>
        <XpConfigEditor courseId={courseId} initialEntries={xpConfig} />
      </section>

      <div className="border-t border-[#1e3320]" />

      {/* Sección 2: Niveles, Títulos y Roles */}
      <section>
        <h3 className="mb-1 font-serif text-lg text-[#f5f0e8]">Niveles, Títulos y Roles</h3>
        <p className="mb-4 text-xs text-[#9aab8a]">
          Definí rangos de niveles con su título y rol simbólico. Estos se muestran en la ficha
          del alumno. Los rangos se aplican en orden.
        </p>
        <TitleRangesEditor courseId={courseId} initialRanges={titleRanges} />
      </section>

      <div className="border-t border-[#1e3320]" />

      {/* Sección 3: Configuración de Bimestre */}
      <section>
        <h3 className="mb-1 font-serif text-lg text-[#f5f0e8]">Configuración de Bimestre</h3>
        <p className="mb-4 text-xs text-[#9aab8a]">
          Fechas de inicio y fin de cada bimestre. Ingresá también la cantidad de tareas
          previstas por tipo — se usa para calcular la proyección de XP.
        </p>
        <BimestreConfigEditor
          courseId={courseId}
          initialEntries={bimestreConfig}
          xpConfig={xpConfig}
        />
      </section>

      <div className="border-t border-[#1e3320]" />

      {/* Sección 4: Clases Formativas */}
      <section>
        <h3 className="mb-1 font-serif text-lg text-[#f5f0e8]">Clases Formativas</h3>
        <p className="mb-4 text-xs text-[#9aab8a]">
          Reiniciá las clases formativas de los alumnos de este curso para que puedan elegir una
          nueva al inicio de cada bimestre.
        </p>
        <ResetClassesButton courseId={courseId} label="Reiniciar clases de este curso" />
      </section>

      <div className="border-t border-[#1e3320]" />

      {/* Sección 5: Calculador de Progresión */}
      <section>
        <h3 className="mb-1 font-serif text-lg text-[#f5f0e8]">Calculador de Progresión</h3>
        <p className="mb-4 text-xs text-[#9aab8a]">
          XP total disponible en el año basado en la configuración de tareas y rangos.
        </p>
        <XpProgressionCalculator
          xpConfig={xpConfig}
          bimestreConfig={bimestreConfig}
          titleRanges={titleRanges}
        />
      </section>
    </div>
  );
}
