import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { EntityName } from "@/types/entities";

const schemaMap = {
  farmers: z.object({
    name: z.string().min(1),
    phone: z.string().min(4),
    email: z.string().email().optional(),
    location: z.string().optional()
  }),
  lands: z.object({
    farmerId: z.string().uuid(),
    landName: z.string().min(1),
    acreage: z.coerce.number().positive(),
    soilType: z.string().optional()
  }),
  crops: z.object({
    name: z.string().min(1),
    season: z.string().min(1),
    variety: z.string().optional()
  }),
  plantings: z.object({
    farmerId: z.string().uuid(),
    landId: z.string().uuid(),
    cropId: z.string().uuid(),
    plantedOn: z.string().min(1),
    expectedHarvestOn: z.string().optional()
  }),
  sensors: z.object({
    name: z.string().min(1),
    sensorType: z.string().min(1),
    unit: z.string().min(1),
    location: z.string().optional()
  }),
  sensor_data: z.object({
    sensorId: z.string().uuid(),
    reading: z.coerce.number(),
    recordedAt: z.string().min(1)
  }),
  markets: z.object({
    marketName: z.string().min(1),
    city: z.string().min(1)
  }),
  sales: z.object({
    farmerId: z.string().uuid(),
    cropId: z.string().uuid(),
    marketId: z.string().uuid().optional(),
    quantity: z.coerce.number().positive(),
    price: z.coerce.number().positive(),
    saleDate: z.string().min(1)
  })
} as const;

export const validEntities = Object.keys(schemaMap) as EntityName[];

export function isEntity(value: string): value is EntityName {
  return validEntities.includes(value as EntityName);
}

export function validateEntityInput(entity: EntityName, input: unknown) {
  const parsed = schemaMap[entity].safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.issues };
  }
  return { ok: true as const, data: parsed.data };
}

function formatSupabaseError(error: {
  message: string;
  code?: string | null;
  details?: string | null;
  hint?: string | null;
}) {
  const code = error.code ?? "UNKNOWN";
  const details = error.details ? ` Details: ${error.details}` : "";
  const hint = error.hint ? ` Hint: ${error.hint}` : "";

  if (code === "42P01") {
    return `Database tables are missing. Run supabase_schema.sql in Supabase SQL Editor. (${code})`;
  }

  return `${error.message} (${code})${details}${hint}`;
}

export async function createRecord(entity: EntityName, data: Record<string, unknown>) {
  const supabase = await createClient();
  const payload =
    entity === "sales"
      ? {
          ...data,
          revenue: Number(data.quantity) * Number(data.price)
        }
      : data;

  const { data: created, error } = await supabase.from(entity).insert(payload).select().single();

  if (error) throw new Error(formatSupabaseError(error));
  return created;
}

export async function listRecords(entity: EntityName) {
  const supabase = await createClient();
  const { data, error } = await supabase.from(entity).select("*").order("createdAt", { ascending: false });

  if (error) throw new Error(formatSupabaseError(error));
  return data ?? [];
}

export async function getRecord(entity: EntityName, id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from(entity).select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(formatSupabaseError(error));
  return data;
}

export async function updateRecord(entity: EntityName, id: string, patch: Record<string, unknown>) {
  const supabase = await createClient();

  const payload =
    entity === "sales"
      ? {
          ...patch,
          revenue: Number(patch.quantity) * Number(patch.price)
        }
      : patch;

  const { data, error } = await supabase.from(entity).update(payload).eq("id", id).select().maybeSingle();

  if (error) throw new Error(formatSupabaseError(error));
  return data;
}

export async function deleteRecord(entity: EntityName, id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from(entity).delete().eq("id", id);

  if (error) throw new Error(formatSupabaseError(error));
  return true;
}

export async function searchFarmers(query: string) {
  const supabase = await createClient();
  const q = query.trim();

  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
    .order("createdAt", { ascending: false });

  if (error) throw new Error(formatSupabaseError(error));
  return data ?? [];
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const [farmers, crops, sales, sensors, sensorData, salesForRevenue, recentSales, recentSensorData] = await Promise.all([
    supabase.from("farmers").select("id", { count: "exact", head: true }),
    supabase.from("crops").select("id", { count: "exact", head: true }),
    supabase.from("sales").select("id", { count: "exact", head: true }),
    supabase.from("sensors").select("id", { count: "exact", head: true }),
    supabase.from("sensor_data").select("id", { count: "exact", head: true }),
    supabase.from("sales").select("revenue"),
    supabase.from("sales").select("*").order("createdAt", { ascending: false }).limit(5),
    supabase.from("sensor_data").select("*").order("createdAt", { ascending: false }).limit(5)
  ]);

  for (const result of [farmers, crops, sales, sensors, sensorData, salesForRevenue, recentSales, recentSensorData]) {
    if (result.error) throw new Error(formatSupabaseError(result.error));
  }

  const totalRevenue = (salesForRevenue.data ?? []).reduce((sum, sale) => sum + Number(sale.revenue ?? 0), 0);

  return {
    totals: {
      farmers: farmers.count ?? 0,
      crops: crops.count ?? 0,
      sales: sales.count ?? 0,
      sensors: sensors.count ?? 0,
      sensorReadings: sensorData.count ?? 0
    },
    totalRevenue,
    recentSales: recentSales.data ?? [],
    recentSensorData: recentSensorData.data ?? []
  };
}
