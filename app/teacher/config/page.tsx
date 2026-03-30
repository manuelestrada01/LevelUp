import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCoursesByTeacher } from "@/lib/supabase/courses";
import { getFormativeClasses } from "@/lib/supabase/classes";
import { getTalentConfig } from "@/lib/supabase/config";
import FormativeClassEditor from "@/docente/components/FormativeClassEditor";
import TalentConfigEditor from "@/docente/components/TalentConfigEditor";

export default async function ConfigMacroPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [courses, formativeClasses, talentConfig] = await Promise.all([
    getCoursesByTeacher(session.user.email),
    getFormativeClasses(),
    getTalentConfig(),
  ]);

  if (courses.length === 0) {
    redirect("/teacher");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">Configuración Macro</h1>
        <p className="mt-1 text-sm text-[#9aab8a]">
          Administrá las Clases Formativas y Talentos disponibles para todos los cursos.
        </p>
      </div>

      <section>
        <h2 className="mb-1 font-serif text-xl text-[#f5f0e8]">Clases Formativas</h2>
        <p className="mb-5 text-xs text-[#9aab8a]">
          Las clases publicadas son visibles para que los alumnos elijan. Son una capa simbólica —
          no afectan la nota institucional.
        </p>
        <FormativeClassEditor initialClasses={formativeClasses} />
      </section>

      <div className="border-t border-[#1e3320]" />

      <section>
        <h2 className="mb-1 font-serif text-xl text-[#f5f0e8]">Talentos</h2>
        <p className="mb-5 text-xs text-[#9aab8a]">
          Los talentos activos pueden ser otorgados por el sistema (según condiciones) o manualmente
          desde el Panel Docente. El mismo talento se otorga una sola vez por alumno.
        </p>
        <TalentConfigEditor initialTalents={talentConfig} />
      </section>
    </div>
  );
}
