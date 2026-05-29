import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  deleteRecord,
  getRecord,
  isEntity,
  updateRecord,
  validateEntityInput
} from "@/lib/entities";

type Params = Promise<{ entity: string; id: string }>;

async function checkAuth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entity, id } = await params;
  if (!isEntity(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }

  const record = await getRecord(entity, id);
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entity, id } = await params;
  if (!isEntity(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }

  const body = await request.json();
  const validation = validateEntityInput(entity, body);

  if (!validation.ok) {
    return NextResponse.json({ error: "Validation error", details: validation.errors }, { status: 400 });
  }

  const updated = await updateRecord(entity, id, validation.data);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entity, id } = await params;
  if (!isEntity(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }

  await deleteRecord(entity, id);
  return new NextResponse(null, { status: 204 });
}
