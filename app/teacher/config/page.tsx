import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ResetClassesButton from "@/docente/components/ResetClassesButton";

export default async function ConfigMacroPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const { data: courses } = await supabase
    .from("courses")
    .select("id")
    .eq("teacher_email", email)
    .limit(1);

  if (!courses?.length) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">Configuración Macro</h1>
        <p className="mt-1 text-sm text-[#9aab8a]">Ajustes globales del sistema</p>
      </div>

      <section className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-6">
        <h2 className="mb-1 font-serif text-lg text-[#f5f0e8]">Clases Formativas</h2>
        <p className="mb-6 text-sm text-[#9aab8a]">
          Reinicia las clases formativas de todos los alumnos del sistema para permitirles elegir
          una nueva al inicio de cada bimestre.
        </p>
        <ResetClassesButton />
      </section>
    </div>
  );
}
