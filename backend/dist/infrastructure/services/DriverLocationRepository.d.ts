import { IDriverLocationRepository, DriverLocationSnapshot } from "../../domain/repositories/IDriverLocationRepository";
import { RedisService } from "../services/RedisService";
export declare class DriverLocationRepository implements IDriverLocationRepository {
    private readonly redisService;
    private readonly client;
    private readonly KEY_PREFIX;
    private readonly TTL_SECONDS;
    constructor(redisService: RedisService);
    private getKey;
    saveDriverLocation(location: DriverLocationSnapshot): Promise<void>;
    getDriverLocation(driverUserId: string): Promise<DriverLocationSnapshot | null>;
}
//# sourceMappingURL=DriverLocationRepository.d.ts.map