import { auth } from "@/auth";
import { upsertFormativeClass, deleteFormativeClass, FormativeClassEntry } from "@/lib/supabase/classes";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { slug } = await params;
  const body: FormativeClassEntry = await req.json();
  await upsertFormativeClass({ ...body, slug });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { slug } = await params;
  await deleteFormativeClass(slug);
  return NextResponse.json({ ok: true });
}
