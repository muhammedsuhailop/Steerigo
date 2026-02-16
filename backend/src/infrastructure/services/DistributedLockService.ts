import { injectable } from "inversify";
import { createClient, RedisClientType } from "redis";
import { Logger } from "@shared/utils/Logger";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { randomUUID } from "crypto";

@injectable()
export class RedisLockService implements IDistributedLockService {
  private client: RedisClientType;
  private isConnected = false;

  private readonly LUA_RELEASE_SCRIPT = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    this.client = createClient({ url: redisUrl });

    this.client.on("error", (err) =>
      Logger.error("Redis Client Error", { err }),
    );

    this.client.on("connect", () => {
      this.isConnected = true;
      Logger.info("Redis client connected");
    });

    this.client.on("end", () => {
      this.isConnected = false;
      Logger.warn("Redis client disconnected");
    });

    void this.client.connect().catch((err) => {
      Logger.error("Failed to connect to Redis", { err });
    });
  }

  async acquireLock(key: string, ttlSeconds: number): Promise<string | null> {
    if (!this.isConnected) {
      Logger.warn("Redis not connected yet, skipping lock acquisition", {
        key,
      });
      return null;
    }

    const token = randomUUID();

    try {
      const result = await this.client.set(key, token, {
        NX: true,
        EX: ttlSeconds,
      });

      if (result === "OK") {
        Logger.debug("Lock acquired", { key, token, ttlSeconds });
        return token;
      }

      Logger.debug("Lock acquisition failed - already held", { key });
      return null;
    } catch (error) {
      Logger.error("Error acquiring lock", { key, error });
      throw error;
    }
  }

  async releaseLock(key: string, token: string): Promise<boolean> {
    if (!this.isConnected) {
      Logger.warn("Redis not connected, cannot release lock", { key });
      return false;
    }

    try {
      const result = await this.client.eval(this.LUA_RELEASE_SCRIPT, {
        keys: [key],
        arguments: [token],
      });

      const released = result === 1;
      Logger.debug("Lock release attempt", { key, token, released });
      return released;
    } catch (error) {
      Logger.error("Error releasing lock", { key, token, error });
      return false;
    }
  }

  async extendLock(
    key: string,
    token: string,
    ttlSeconds: number,
  ): Promise<boolean> {
    if (!this.isConnected) {
      Logger.warn("Redis not connected, cannot extend lock", { key });
      return false;
    }

    try {
      const currentValue = await this.client.get(key);
      if (currentValue === token) {
        await this.client.expire(key, ttlSeconds);
        Logger.debug("Lock extended", { key, token, ttlSeconds });
        return true;
      }
      return false;
    } catch (error) {
      Logger.error("Error extending lock", { key, error });
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }
}
