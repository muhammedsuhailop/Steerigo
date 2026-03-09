import { injectable, inject } from "inversify";
import { RedisClientType } from "redis";
import {
  IDriverLocationRepository,
  DriverLocationSnapshot,
} from "@domain/repositories/IDriverLocationRepository";
import { Location } from "@domain/value-objects/Location";
import { Logger } from "@shared/utils/Logger";
import { RedisService } from "@infrastructure/services/RedisService";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class DriverLocationRepository implements IDriverLocationRepository {
  private readonly client: RedisClientType;

  private readonly KEY_PREFIX = "driver:location:";
  private readonly TTL_SECONDS = 60 * 5;

  constructor(
    @inject(TYPES.RedisService)
    private readonly redisService: RedisService,
  ) {
    this.client = this.redisService.getClient();
  }

  private getKey(driverUserId: string): string {
    return `${this.KEY_PREFIX}${driverUserId}`;
  }

  async saveDriverLocation(location: DriverLocationSnapshot): Promise<void> {
    if (!this.redisService.connectionStatus) {
      Logger.warn(
        "DriverLocationRepository: Redis not connected, skipping saveDriverLocation",
        { driverUserId: location.driverUserId },
      );
      return;
    }

    const validated = Location.create(location.coordinates);

    const value = JSON.stringify({
      lat: validated.getLatitude(),
      lng: validated.getLongitude(),
      address: validated.getAddress(),
      bearing: location.bearing,
      speedKph: location.speedKph,
      accuracy: location.accuracy,
      updatedAt: location.updatedAt.toISOString(),
    });

    const key = this.getKey(location.driverUserId);

    try {
      await this.client.set(key, value, { EX: this.TTL_SECONDS });

      Logger.debug("Driver location saved to Redis", {
        driverUserId: location.driverUserId,
        key,
      });
    } catch (error) {
      Logger.error("Error saving driver location to Redis", {
        driverUserId: location.driverUserId,
        error,
      });

      throw error;
    }
  }

  async getDriverLocation(
    driverUserId: string,
  ): Promise<DriverLocationSnapshot | null> {
    if (!this.redisService.connectionStatus) {
      Logger.warn(
        "DriverLocationRepository: Redis not connected, getDriverLocation returns null",
        { driverUserId },
      );
      return null;
    }

    const key = this.getKey(driverUserId);

    try {
      const raw = await this.client.get(key);

      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as {
        lat: number;
        lng: number;
        address?: string;
        bearing?: number;
        speedKph?: number;
        accuracy?: number;
        updatedAt: string;
      };

      const coordinates = {
        latitude: parsed.lat,
        longitude: parsed.lng,
        address: parsed.address,
      };

      const updatedAt = new Date(parsed.updatedAt);

      return {
        driverUserId,
        coordinates,
        bearing: parsed.bearing,
        speedKph: parsed.speedKph,
        accuracy: parsed.accuracy,
        updatedAt,
      };
    } catch (error) {
      Logger.error("Error reading driver location from Redis", {
        driverUserId,
        error,
      });

      throw error;
    }
  }
}
