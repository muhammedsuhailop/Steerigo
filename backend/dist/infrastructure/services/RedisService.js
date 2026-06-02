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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const inversify_1 = require("inversify");
const redis_1 = require("redis");
const Logger_1 = require("@shared/utils/Logger");
let RedisService = class RedisService {
    constructor() {
        this.isConnected = false;
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
        this.client = (0, redis_1.createClient)({ url: redisUrl });
        this.client.on("error", (err) => Logger_1.Logger.error("Redis Client Error", { err }));
        this.client.on("connect", () => {
            this.isConnected = true;
            Logger_1.Logger.info("Redis client connected");
        });
        this.client.on("end", () => {
            this.isConnected = false;
            Logger_1.Logger.warn("Redis client disconnected");
        });
        void this.client.connect().catch((err) => {
            Logger_1.Logger.error("Failed to connect to Redis", { err });
        });
    }
    getClient() {
        return this.client;
    }
    get connectionStatus() {
        return this.isConnected;
    }
    async disconnect() {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
//# sourceMappingURL=RedisService.js.map