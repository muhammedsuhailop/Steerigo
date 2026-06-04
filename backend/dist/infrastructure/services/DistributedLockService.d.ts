import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { RedisService } from "./RedisService";
export declare class RedisLockService implements IDistributedLockService {
    private readonly redisService;
    private readonly client;
    private readonly LUA_RELEASE_SCRIPT;
    constructor(redisService: RedisService);
    acquireLock(key: string, ttlSeconds: number): Promise<string | null>;
    releaseLock(key: string, token: string): Promise<boolean>;
    extendLock(key: string, token: string, ttlSeconds: number): Promise<boolean>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=DistributedLockService.d.ts.map