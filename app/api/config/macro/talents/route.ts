import { auth } from "@/auth";
import { getTalentConfig, upsertTalentConfig, TalentConfigEntry } from "@/lib/supabase/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const data = await getTalentConfig();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const entry: TalentConfigEntry = await req.json();
  await upsertTalentConfig(entry);
  return NextResponse.json({ ok: true });
}
