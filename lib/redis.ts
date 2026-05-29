import Redis from "ioredis";

const host = process.env.REDIS_HOST ?? "127.0.0.1";
const port = Number(process.env.REDIS_PORT ?? 6379);
const password = process.env.REDIS_PASSWORD || undefined;

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export const redis =
  globalForRedis.redis ??
  new Redis({
    host,
    port,
    password,
    maxRetriesPerRequest: 1,
    lazyConnect: true
  });

if (!globalForRedis.redis) {
  globalForRedis.redis = redis;
}

export async function ensureRedisConnection() {
  if (redis.status === "ready") return;
  if (redis.status === "connecting") return;
  await redis.connect();
}
