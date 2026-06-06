"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisLockService = void 0;
const inversify_1 = require("inversify");
const Logger_1 = require("../../shared/utils/Logger");
const crypto_1 = require("crypto");
const RedisService_1 = require("./RedisService");
const DITypes_1 = require("../../shared/constants/DITypes");
let RedisLockService = class RedisLockService {
    constructor(redisService) {
        this.redisService = redisService;
        this.LUA_RELEASE_SCRIPT = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
        this.client = this.redisService.getClient();
    }
    async acquireLock(key, ttlSeconds) {
        if (!this.redisService.connectionStatus) {
            Logger_1.Logger.warn("Redis not connected yet, skipping lock acquisition", {
                key,
            });
            return null;
        }
        const token = (0, crypto_1.randomUUID)();
        try {
            const result = await this.client.set(key, token, {
                NX: true,
                EX: ttlSeconds,
            });
            if (result === "OK") {
                Logger_1.Logger.debug("Lock acquired", { key, token, ttlSeconds });
                return token;
            }
            Logger_1.Logger.debug("Lock acquisition failed - already held", { key });
            return null;
        }
        catch (error) {
            Logger_1.Logger.error("Error acquiring lock", { key, error });
            throw error;
        }
    }
    async releaseLock(key, token) {
        if (!this.redisService.connectionStatus) {
            Logger_1.Logger.warn("Redis not connected, cannot release lock", { key });
            return false;
        }
        try {
            const result = await this.client.eval(this.LUA_RELEASE_SCRIPT, {
                keys: [key],
                arguments: [token],
            });
            const released = result === 1;
            Logger_1.Logger.debug("Lock release attempt", {
                key,
                token,
                released,
            });
            return released;
        }
        catch (error) {
            Logger_1.Logger.error("Error releasing lock", { key, token, error });
            return false;
        }
    }
    async extendLock(key, token, ttlSeconds) {
        if (!this.redisService.connectionStatus) {
            Logger_1.Logger.warn("Redis not connected, cannot extend lock", { key });
            return false;
        }
        try {
            const currentValue = await this.client.get(key);
            if (currentValue === token) {
                await this.client.expire(key, ttlSeconds);
                Logger_1.Logger.debug("Lock extended", {
                    key,
                    token,
                    ttlSeconds,
                });
                return true;
            }
            return false;
        }
        catch (error) {
            Logger_1.Logger.error("Error extending lock", { key, error });
            return false;
        }
    }
    async disconnect() {
        Logger_1.Logger.warn("RedisLockService disconnect called - skipped (shared client)");
    }
};
exports.RedisLockService = RedisLockService;
exports.RedisLockService = RedisLockService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RedisService)),
    __metadata("design:paramtypes", [RedisService_1.RedisService])
], RedisLockService);
//# sourceMappingURL=DistributedLockService.js.map