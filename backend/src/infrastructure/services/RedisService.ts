import { injectable } from "inversify";
import { createClient, RedisClientType } from "redis";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class RedisService {
  private readonly client: RedisClientType;
  private isConnected = false;

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

  public getClient(): RedisClientType {
    return this.client;
  }

  public get connectionStatus(): boolean {
    return this.isConnected;
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }
}
