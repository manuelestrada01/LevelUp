import { auth } from "@/auth";
import { getLevelConfig, upsertLevelConfig, LevelConfigEntry } from "@/lib/supabase/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const data = await getLevelConfig();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const entries: LevelConfigEntry[] = await req.json();
  await upsertLevelConfig(entries);
  return NextResponse.json({ ok: true });
}
