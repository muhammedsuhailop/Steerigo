"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBullMQConnection = getBullMQConnection;
exports.closeBullMQConnection = closeBullMQConnection;
const ioredis_1 = __importDefault(require("ioredis"));
let sharedConnection = null;
function buildRedisOptions() {
    //   const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    return {
        lazyConnect: false,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy(times) {
            return Math.min(times * 100, 2000);
        },
    };
}
function getBullMQConnection() {
    if (!sharedConnection) {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
        sharedConnection = new ioredis_1.default(redisUrl, buildRedisOptions());
    }
    return sharedConnection;
}
async function closeBullMQConnection() {
    if (sharedConnection) {
        await sharedConnection.quit();
        sharedConnection = null;
    }
}
//# sourceMappingURL=BullMQConnection.js.map