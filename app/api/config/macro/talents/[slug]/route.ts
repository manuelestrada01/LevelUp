import { auth } from "@/auth";
import { upsertTalentConfig, deleteTalentConfig, TalentConfigEntry } from "@/lib/supabase/config";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { slug } = await params;
  const body: TalentConfigEntry = await req.json();
  await upsertTalentConfig({ ...body, slug });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { slug } = await params;
  await deleteTalentConfig(slug);
  return NextResponse.json({ ok: true });
}
