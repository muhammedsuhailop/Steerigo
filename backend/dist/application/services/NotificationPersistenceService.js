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
exports.NotificationPersistenceService = void 0;
const inversify_1 = require("inversify");
const CreateNotificationDto_1 = require("../dto/notification/CreateNotificationDto");
const NotificationChannel_1 = require("../../domain/value-objects/NotificationChannel");
const Logger_1 = require("../../shared/utils/Logger");
const DITypes_1 = require("../../shared/constants/DITypes");
let NotificationPersistenceService = class NotificationPersistenceService {
    constructor(createNotificationUseCase) {
        this.createNotificationUseCase = createNotificationUseCase;
    }
    async persistNotification(recipientId, data) {
        try {
            const dto = CreateNotificationDto_1.CreateNotificationDto.fromPayload({
                recipientId,
                type: data.type,
                channel: NotificationChannel_1.NotificationChannel.IN_APP,
                title: data.title,
                body: data.body,
                metadata: data.metadata,
            });
            const result = await this.createNotificationUseCase.execute(dto);
            if (result.isFailure()) {
                Logger_1.Logger.error("Notification persist failed", {
                    recipientId,
                    error: result.getError().message,
                });
                return null;
            }
            const notification = result.getValue().data;
            Logger_1.Logger.info("Notification persisted", {
                recipientId,
                notificationId: notification.notificationId,
                type: data.type,
            });
            return { notificationId: notification.notificationId };
        }
        catch (error) {
            Logger_1.Logger.error("Unexpected notification persistence error", {
                recipientId,
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
    }
};
exports.NotificationPersistenceService = NotificationPersistenceService;
exports.NotificationPersistenceService = NotificationPersistenceService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CreateNotificationUseCase)),
    __metadata("design:paramtypes", [Object])
], NotificationPersistenceService);
//# sourceMappingURL=NotificationPersistenceService.js.map