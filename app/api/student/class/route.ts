import { getAuthSession } from "@/lib/session";
import { getProfile, saveProfile } from "@/lib/supabase/profiles";
import { getFormativeClasses, addClassHistory } from "@/lib/supabase/classes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { formativeClass } = await req.json();

  const publishedClasses = await getFormativeClasses(true);
  const validSlugs = publishedClasses.map((c) => c.slug);

  if (!validSlugs.includes(formativeClass)) {
    return NextResponse.json({ error: "Clase inválida o no disponible" }, { status: 400 });
  }

  const email = session.user.email;

  const existingProfile = await getProfile(email);
  const changedFrom = existingProfile?.formative_class ?? null;

  try {
    await saveProfile(email, formativeClass);
    await addClassHistory(email, formativeClass, changedFrom !== formativeClass ? changedFrom : null);
  } catch {
    return NextResponse.json({ error: "Error al guardar perfil" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
