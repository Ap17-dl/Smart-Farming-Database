import { z } from "zod";
import { ensureRedisConnection, redis } from "@/lib/redis";
import type { EntityName } from "@/types/entities";

const now = () => new Date().toISOString();

const schemaMap = {
  farmers: z.object({
    name: z.string().min(1),
    phone: z.string().min(4),
    email: z.string().email().optional(),
    location: z.string().optional()
  }),
  lands: z.object({
    farmerId: z.string().min(1),
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
    farmerId: z.string().min(1),
    landId: z.string().min(1),
    cropId: z.string().min(1),
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
    sensorId: z.string().min(1),
    reading: z.coerce.number(),
    recordedAt: z.string().min(1)
  }),
  markets: z.object({
    marketName: z.string().min(1),
    city: z.string().min(1)
  }),
  sales: z.object({
    farmerId: z.string().min(1),
    cropId: z.string().min(1),
    marketId: z.string().optional(),
    quantity: z.coerce.number().positive(),
    price: z.coerce.number().positive(),
    saleDate: z.string().min(1)
  })
} as const;

export const validEntities = Object.keys(schemaMap) as EntityName[];

const setKey = (entity: EntityName) => `sf:${entity}:ids`;
const itemKey = (entity: EntityName, id: string) => `sf:${entity}:${id}`;

const parseJSON = <T>(value: string | null): T | null => {
  if (!value) return null;
  return JSON.parse(value) as T;
};

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

export async function createRecord(entity: EntityName, data: Record<string, unknown>) {
  await ensureRedisConnection();
  const id = crypto.randomUUID();
  const timestamp = now();

  const record = {
    ...data,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...(entity === "sales"
      ? {
          revenue: Number(data.quantity) * Number(data.price)
        }
      : {})
  };

  await redis.multi().set(itemKey(entity, id), JSON.stringify(record)).sadd(setKey(entity), id).exec();
  return record;
}

export async function listRecords(entity: EntityName) {
  await ensureRedisConnection();
  const ids = await redis.smembers(setKey(entity));
  if (ids.length === 0) return [];

  const keys = ids.map((id) => itemKey(entity, id));
  const values = await redis.mget(keys);

  return values
    .map((v) => parseJSON<Record<string, unknown>>(v))
    .filter((v): v is Record<string, unknown> => v !== null)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export async function getRecord(entity: EntityName, id: string) {
  await ensureRedisConnection();
  const value = await redis.get(itemKey(entity, id));
  return parseJSON<Record<string, unknown>>(value);
}

export async function updateRecord(entity: EntityName, id: string, patch: Record<string, unknown>) {
  await ensureRedisConnection();
  const existing = await getRecord(entity, id);
  if (!existing) return null;

  const merged = {
    ...existing,
    ...patch,
    id,
    createdAt: existing.createdAt,
    updatedAt: now(),
    ...(entity === "sales"
      ? {
          revenue: Number(patch.quantity ?? existing.quantity) * Number(patch.price ?? existing.price)
        }
      : {})
  };

  await redis.set(itemKey(entity, id), JSON.stringify(merged));
  return merged;
}

export async function deleteRecord(entity: EntityName, id: string) {
  await ensureRedisConnection();
  const deleted = await redis.multi().del(itemKey(entity, id)).srem(setKey(entity), id).exec();
  return deleted?.length ? true : false;
}

export async function searchFarmers(query: string) {
  const farmers = await listRecords("farmers");
  const q = query.toLowerCase();

  return farmers.filter((farmer) => {
    const name = String(farmer.name ?? "").toLowerCase();
    const phone = String(farmer.phone ?? "").toLowerCase();
    return name.includes(q) || phone.includes(q);
  });
}

export async function getDashboardStats() {
  const [farmers, crops, sales, sensors, sensorData] = await Promise.all([
    listRecords("farmers"),
    listRecords("crops"),
    listRecords("sales"),
    listRecords("sensors"),
    listRecords("sensor_data")
  ]);

  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.revenue ?? 0), 0);

  return {
    totals: {
      farmers: farmers.length,
      crops: crops.length,
      sales: sales.length,
      sensors: sensors.length,
      sensorReadings: sensorData.length
    },
    totalRevenue,
    recentSales: sales.slice(0, 5),
    recentSensorData: sensorData.slice(0, 5)
  };
}
