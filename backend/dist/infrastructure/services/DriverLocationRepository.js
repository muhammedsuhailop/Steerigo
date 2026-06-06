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
exports.DriverLocationRepository = void 0;
const inversify_1 = require("inversify");
const Location_1 = require("../../domain/value-objects/Location");
const Logger_1 = require("../../shared/utils/Logger");
const RedisService_1 = require("../services/RedisService");
const DITypes_1 = require("../../shared/constants/DITypes");
let DriverLocationRepository = class DriverLocationRepository {
    constructor(redisService) {
        this.redisService = redisService;
        this.KEY_PREFIX = "driver:location:";
        this.TTL_SECONDS = 60 * 5;
        this.client = this.redisService.getClient();
    }
    getKey(driverUserId) {
        return `${this.KEY_PREFIX}${driverUserId}`;
    }
    async saveDriverLocation(location) {
        if (!this.redisService.connectionStatus) {
            Logger_1.Logger.warn("DriverLocationRepository: Redis not connected, skipping saveDriverLocation", { driverUserId: location.driverUserId });
            return;
        }
        const validated = Location_1.Location.create(location.coordinates);
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
            Logger_1.Logger.debug("Driver location saved to Redis", {
                driverUserId: location.driverUserId,
                key,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error saving driver location to Redis", {
                driverUserId: location.driverUserId,
                error,
            });
            throw error;
        }
    }
    async getDriverLocation(driverUserId) {
        if (!this.redisService.connectionStatus) {
            Logger_1.Logger.warn("DriverLocationRepository: Redis not connected, getDriverLocation returns null", { driverUserId });
            return null;
        }
        const key = this.getKey(driverUserId);
        try {
            const raw = await this.client.get(key);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
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
        }
        catch (error) {
            Logger_1.Logger.error("Error reading driver location from Redis", {
                driverUserId,
                error,
            });
            throw error;
        }
    }
};
exports.DriverLocationRepository = DriverLocationRepository;
exports.DriverLocationRepository = DriverLocationRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RedisService)),
    __metadata("design:paramtypes", [RedisService_1.RedisService])
], DriverLocationRepository);
//# sourceMappingURL=DriverLocationRepository.js.map