import { createClient, RedisClientType } from "redis";
import { Logger } from "@shared/utils/Logger";

export function createRedisPubSubPublisher(): RedisClientType {
  const client = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
  }) as RedisClientType;

  client.on("error", (err) =>
    Logger.error("Redis publisher error", { error: err.message }),
  );

  return client;
}

export function createRedisPubSubSubscriber(): RedisClientType {
  const client = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
  }) as RedisClientType;

  client.on("error", (err) =>
    Logger.error("Redis subscriber error", { error: err.message }),
  );

  return client;
}
