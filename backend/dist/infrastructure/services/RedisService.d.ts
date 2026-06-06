import { RedisClientType } from "redis";
export declare class RedisService {
    private readonly client;
    private isConnected;
    constructor();
    getClient(): RedisClientType;
    get connectionStatus(): boolean;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=RedisService.d.ts.map