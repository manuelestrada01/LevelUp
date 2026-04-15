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
    <div className="flex flex-col gap-10">
      {/* Sección 1: XP por Tipo de Producción */}
      <section>
        <h3 className="mb-1 font-serif text-base uppercase tracking-[0.1em] text-[rgba(200,168,75,0.85)]">
          XP por Tipo de Producción
        </h3>
        <p className="mb-4 text-xs text-[rgba(160,125,55,0.65)]">
          Asigná XP base y bonus por entrega temprana para cada tipo de producción.
          Dejá vacío para usar los valores globales.
        </p>
        <XpConfigEditor courseId={courseId} initialEntries={xpConfig} />
      </section>

      <div style={{ borderTop: "1px solid rgba(160,125,55,0.15)" }} />

      {/* Sección 2: Niveles, Títulos y Roles */}
      <section>
        <h3 className="mb-1 font-serif text-base uppercase tracking-[0.1em] text-[rgba(200,168,75,0.85)]">
          Niveles, Títulos y Roles
        </h3>
        <p className="mb-4 text-xs text-[rgba(160,125,55,0.65)]">
          Definí rangos de niveles con su título y rol simbólico. Estos se muestran en la ficha
          del alumno. Los rangos se aplican en orden.
        </p>
        <TitleRangesEditor courseId={courseId} initialRanges={titleRanges} />
      </section>

      <div style={{ borderTop: "1px solid rgba(160,125,55,0.15)" }} />

      {/* Sección 3: Configuración de Bimestre */}
      <section>
        <h3 className="mb-1 font-serif text-base uppercase tracking-[0.1em] text-[rgba(200,168,75,0.85)]">
          Configuración de Bimestre
        </h3>
        <p className="mb-4 text-xs text-[rgba(160,125,55,0.65)]">
          Fechas de inicio y fin de cada bimestre. Ingresá también la cantidad de tareas
          previstas por tipo — se usa para calcular la proyección de XP.
        </p>
        <BimestreConfigEditor
          courseId={courseId}
          initialEntries={bimestreConfig}
          xpConfig={xpConfig}
        />
      </section>

      <div style={{ borderTop: "1px solid rgba(160,125,55,0.15)" }} />

      {/* Sección 4: Clases Formativas */}
      <section>
        <h3 className="mb-1 font-serif text-base uppercase tracking-[0.1em] text-[rgba(200,168,75,0.85)]">
          Clases Formativas
        </h3>
        <p className="mb-4 text-xs text-[rgba(160,125,55,0.65)]">
          Reiniciá las clases formativas de los alumnos de este curso para que puedan elegir una
          nueva al inicio de cada bimestre.
        </p>
        <ResetClassesButton courseId={courseId} label="Reiniciar clases de este curso" />
      </section>

      <div style={{ borderTop: "1px solid rgba(160,125,55,0.15)" }} />

      {/* Sección 5: Calculador de Progresión */}
      <section>
        <h3 className="mb-1 font-serif text-base uppercase tracking-[0.1em] text-[rgba(200,168,75,0.85)]">
          Calculador de Progresión
        </h3>
        <p className="mb-4 text-xs text-[rgba(160,125,55,0.65)]">
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
