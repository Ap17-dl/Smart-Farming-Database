import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createRecord,
  isEntity,
  listRecords,
  searchFarmers,
  validateEntityInput
} from "@/lib/entities";

type Params = Promise<{ entity: string }>;

async function checkAuth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entity } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
    }

    if (entity === "farmers") {
      const query = request.nextUrl.searchParams.get("query");
      if (query) {
        const results = await searchFarmers(query);
        return NextResponse.json(results);
      }
    }

    const items = await listRecords(entity);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entity } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
    }

    const body = await request.json();
    const validation = validateEntityInput(entity, body);

    if (!validation.ok) {
      return NextResponse.json({ error: "Validation error", details: validation.errors }, { status: 400 });
    }

    const created = await createRecord(entity, validation.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
