import { auth } from "@/auth";
import { getFormativeClasses, upsertFormativeClass, FormativeClassEntry } from "@/lib/supabase/classes";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const data = await getFormativeClasses();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const entry: FormativeClassEntry = await req.json();
  await upsertFormativeClass(entry);
  return NextResponse.json({ ok: true });
}
