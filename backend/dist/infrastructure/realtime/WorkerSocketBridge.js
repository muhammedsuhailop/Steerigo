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
exports.WorkerSocketBridge = void 0;
const inversify_1 = require("inversify");
const RedisPubSubClient_1 = require("./RedisPubSubClient");
const socket_1 = require("./socket");
const SocketEvents_1 = require("./constants/SocketEvents");
const Logger_1 = require("../../shared/utils/Logger");
const PubSubChannels_1 = require("./constants/PubSubChannels");
const DITypes_1 = require("../../shared/constants/DITypes");
const CreateNotificationDto_1 = require("../../application/dto/notification/CreateNotificationDto");
const NotificationType_1 = require("../../domain/value-objects/NotificationType");
const NotificationChannel_1 = require("../../domain/value-objects/NotificationChannel");
let WorkerSocketBridge = class WorkerSocketBridge {
    constructor(createNotificationUseCase) {
        this.createNotificationUseCase = createNotificationUseCase;
        this.subscriber = null;
    }
    async start() {
        this.subscriber = (0, RedisPubSubClient_1.createRedisPubSubSubscriber)();
        await this.subscriber.connect();
        // Listen for ride search progress updates from worker
        await this.subscriber.subscribe(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_SEARCH_PROGRESS, (message) => {
            try {
                const payload = JSON.parse(message);
                const io = (0, socket_1.getRideSocketServer)();
                io.to(`rider:${payload.riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_SEARCH_PROGRESS_UPDATED, {
                    requestGroupId: payload.requestGroupId,
                    currentIndex: payload.currentIndex,
                    totalCandidates: payload.totalCandidates,
                    message: payload.message,
                    status: payload.status,
                });
                Logger_1.Logger.debug("Forwarded search progress to rider socket", {
                    riderId: payload.riderId,
                    requestGroupId: payload.requestGroupId,
                    status: payload.status,
                });
            }
            catch (error) {
                Logger_1.Logger.error("Failed to forward search progress from Redis", {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
        // Listen for new ride request notifications (driver gets notified)
        await this.subscriber.subscribe(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_REQUEST_CREATED, (message) => {
            try {
                const payload = JSON.parse(message);
                const { driverId, ...rest } = payload;
                const io = (0, socket_1.getRideSocketServer)();
                io.to(`driver:${driverId}`).emit(SocketEvents_1.SOCKET_EVENTS.DRIVER_REQUEST_CREATED, rest);
                Logger_1.Logger.debug("Forwarded new ride request to driver socket", {
                    driverId,
                    requestId: rest.requestId,
                });
            }
            catch (error) {
                Logger_1.Logger.error("Failed to forward ride request created from Redis", {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
        // Listen for no driver found — notify rider
        await this.subscriber.subscribe(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND, async (message) => {
            try {
                const payload = JSON.parse(message);
                const io = (0, socket_1.getRideSocketServer)();
                io.to(`rider:${payload.riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_NO_DRIVER_FOUND, {
                    requestGroupId: payload.requestGroupId,
                    reason: payload.reason,
                });
                const dto = CreateNotificationDto_1.CreateNotificationDto.fromPayload({
                    recipientId: payload.riderId,
                    type: NotificationType_1.NotificationType.RIDE_NO_DRIVER_FOUND,
                    channel: NotificationChannel_1.NotificationChannel.IN_APP,
                    title: "No drivers found",
                    body: "No drivers available at the moment.",
                    metadata: {
                        requestGroupId: payload.requestGroupId,
                        reason: payload.reason,
                    },
                });
                await this.createNotificationUseCase.execute(dto);
                Logger_1.Logger.info("No driver found handled (ride + notification)", {
                    riderId: payload.riderId,
                    requestGroupId: payload.requestGroupId,
                });
            }
            catch (error) {
                Logger_1.Logger.error("Failed to handle no driver found", {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
        Logger_1.Logger.info("WorkerSocketBridge started — subscribed to Redis channels", {
            channels: Object.values(PubSubChannels_1.PUBSUB_CHANNELS),
        });
        //Listen for Ride Request Expired - driver
        await this.subscriber.subscribe(PubSubChannels_1.PUBSUB_CHANNELS.RIDE_REQUEST_EXPIRED, (message) => {
            try {
                const payload = JSON.parse(message);
                const { driverUserId, ...rest } = payload;
                const io = (0, socket_1.getRideSocketServer)();
                io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.RIDE_REQUEST_EXPIRED, rest);
                Logger_1.Logger.debug("Forwarded ride request expiry to driver socket", {
                    driverUserId,
                    requestId: rest.requestId,
                });
            }
            catch (error) {
                Logger_1.Logger.error("Failed to forward ride request expiry from Redis", {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    async stop() {
        if (this.subscriber) {
            await this.subscriber.unsubscribe();
            await this.subscriber.disconnect();
            this.subscriber = null;
            Logger_1.Logger.info("WorkerSocketBridge stopped");
        }
    }
};
exports.WorkerSocketBridge = WorkerSocketBridge;
exports.WorkerSocketBridge = WorkerSocketBridge = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CreateNotificationUseCase)),
    __metadata("design:paramtypes", [Object])
], WorkerSocketBridge);
//# sourceMappingURL=WorkerSocketBridge.js.map