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
exports.MarkNotificationsReadUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const NotificationError_1 = require("@domain/errors/NotificationError");
const NotificationMessages_1 = require("@shared/constants/NotificationMessages");
let MarkNotificationsReadUseCase = class MarkNotificationsReadUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Marking notifications as read", {
                userId: dto.getUserId(),
                notificationId: dto.getNotificationId(),
                markAll: dto.isMarkAll(),
            });
            let updatedCount;
            if (dto.isMarkAll()) {
                updatedCount = await this.notificationRepository.markAllAsRead(dto.getUserId());
                Logger_1.Logger.info("All notifications marked as read", {
                    userId: dto.getUserId(),
                    updatedCount,
                });
            }
            else {
                const notificationId = dto.getNotificationId();
                if (!notificationId) {
                    return Result_1.Result.failure(NotificationError_1.NotificationErrors.notificationIdOrMarkAllRequired());
                }
                const updated = await this.notificationRepository.markOneAsRead(notificationId, dto.getUserId());
                if (!updated) {
                    return Result_1.Result.failure(NotificationError_1.NotificationErrors.notificationNotFound(notificationId));
                }
                updatedCount = 1;
                Logger_1.Logger.info("Single notification marked as read", {
                    userId: dto.getUserId(),
                    notificationId,
                });
            }
            return Result_1.Result.success({
                success: true,
                message: NotificationMessages_1.NOTIFICATION_MESSAGES.MARKED_AS_READ,
                data: { updatedCount },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error marking notifications as read", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.MarkNotificationsReadUseCase = MarkNotificationsReadUseCase;
exports.MarkNotificationsReadUseCase = MarkNotificationsReadUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.NotificationRepository)),
    __metadata("design:paramtypes", [Object])
], MarkNotificationsReadUseCase);
//# sourceMappingURL=MarkNotificationsReadUseCase.js.map