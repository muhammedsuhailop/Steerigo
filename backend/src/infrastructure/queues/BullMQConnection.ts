import IORedis, { RedisOptions } from "ioredis";

let sharedConnection: IORedis | null = null;

function buildRedisOptions(): RedisOptions {
//   const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  return {
    lazyConnect: false,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      return Math.min(times * 100, 2000);
    },
  };
}

export function getBullMQConnection(): IORedis {
  if (!sharedConnection) {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    sharedConnection = new IORedis(redisUrl, buildRedisOptions());
  }

  return sharedConnection;
}

export async function closeBullMQConnection(): Promise<void> {
  if (sharedConnection) {
    await sharedConnection.quit();
    sharedConnection = null;
  }
}
