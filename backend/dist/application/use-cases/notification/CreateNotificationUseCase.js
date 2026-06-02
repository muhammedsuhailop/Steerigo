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
exports.CreateNotificationUseCase = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const Notification_1 = require("../../../domain/entities/Notification");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const NotificationMessages_1 = require("../../../shared/constants/NotificationMessages");
let CreateNotificationUseCase = class CreateNotificationUseCase {
    constructor(notificationRepository, realtimePublisher) {
        this.notificationRepository = notificationRepository;
        this.realtimePublisher = realtimePublisher;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Creating notification", {
                recipientId: dto.getRecipientId(),
                type: dto.getType(),
                channel: dto.getChannel(),
            });
            const notification = Notification_1.Notification.create({
                id: new mongoose_1.Types.ObjectId().toString(),
                recipientId: dto.getRecipientId(),
                type: dto.getType(),
                channel: dto.getChannel(),
                title: dto.getTitle(),
                body: dto.getBody(),
                metadata: dto.getMetadata(),
            });
            const saved = await this.notificationRepository.save(notification);
            Logger_1.Logger.info("Notification created successfully", {
                id: saved.getId(),
                recipientId: saved.getRecipientId(),
                type: saved.getType(),
            });
            this.realtimePublisher.emitToUser(saved.getRecipientId(), saved.getId(), saved.getType(), saved.getTitle(), saved.getBody(), saved.getMetadata() || {});
            return Result_1.Result.success({
                success: true,
                message: NotificationMessages_1.NOTIFICATION_MESSAGES.CREATED_SUCCESSFULLY,
                data: { notificationId: saved.getId() },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error creating notification", {
                recipientId: dto.getRecipientId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.CreateNotificationUseCase = CreateNotificationUseCase;
exports.CreateNotificationUseCase = CreateNotificationUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.NotificationRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.NotificationRealtimePublisher)),
    __metadata("design:paramtypes", [Object, Object])
], CreateNotificationUseCase);
//# sourceMappingURL=CreateNotificationUseCase.js.map