import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profiles";
import ClassSelector from "@/clases-formativas/components/ClassSelector";

export default async function ElegirClasePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // Si ya tiene clase, redirigir al dashboard
  const profile = await getProfile(session.user.email);
  if (profile) redirect("/");

  return (
    <div className="min-h-screen bg-[#0d1a0f] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#9aab8a] mb-3">
            Bienvenido al Visor
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#f5f0e8] mb-3">
            Elegí tu Clase Formativa
          </h1>
          <p className="text-[#9aab8a] text-sm max-w-lg mx-auto leading-relaxed">
            Esta elección define tu identidad en el visor. Refleja quién sos como estudiante.
            Solo podés elegir una vez.
          </p>
        </div>

        <ClassSelector email={session.user.email} />
      </div>
    </div>
  );
}
