"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisPubSubPublisher = createRedisPubSubPublisher;
exports.createRedisPubSubSubscriber = createRedisPubSubSubscriber;
const redis_1 = require("redis");
const Logger_1 = require("@shared/utils/Logger");
function createRedisPubSubPublisher() {
    const client = (0, redis_1.createClient)({
        url: process.env.REDIS_URL ?? "redis://localhost:6379",
    });
    client.on("error", (err) => Logger_1.Logger.error("Redis publisher error", { error: err.message }));
    return client;
}
function createRedisPubSubSubscriber() {
    const client = (0, redis_1.createClient)({
        url: process.env.REDIS_URL ?? "redis://localhost:6379",
    });
    client.on("error", (err) => Logger_1.Logger.error("Redis subscriber error", { error: err.message }));
    return client;
}
//# sourceMappingURL=RedisPubSubClient.js.map