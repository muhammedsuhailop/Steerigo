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
exports.GetNotificationsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const NotificationMessages_1 = require("../../../shared/constants/NotificationMessages");
let GetNotificationsUseCase = class GetNotificationsUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Fetching notifications", {
                userId: dto.getUserId(),
                page: dto.getPage(),
                isRead: dto.getIsRead(),
            });
            const [paginatedResult, unreadCount] = await Promise.all([
                this.notificationRepository.findByRecipientId(dto.getUserId(), {
                    page: dto.getPage(),
                    limit: dto.getLimit(),
                    sortOrder: dto.getSortOrder(),
                    isRead: dto.getIsRead(),
                    type: dto.getType(),
                    channel: dto.getChannel(),
                    fromDate: dto.getFromDate(),
                    toDate: dto.getToDate(),
                }),
                this.notificationRepository.countUnread(dto.getUserId()),
            ]);
            const notifications = paginatedResult.data.map((n) => this.mapToNotificationData(n));
            Logger_1.Logger.info("Notifications fetched successfully", {
                userId: dto.getUserId(),
                total: paginatedResult.total,
                unreadCount,
            });
            return Result_1.Result.success({
                success: true,
                message: NotificationMessages_1.NOTIFICATION_MESSAGES.FETCHED_SUCCESSFULLY,
                data: {
                    notifications,
                    unreadCount,
                    pagination: {
                        total: paginatedResult.total,
                        page: paginatedResult.page,
                        limit: paginatedResult.limit,
                        totalPages: paginatedResult.totalPages,
                    },
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching notifications", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
    mapToNotificationData(notification) {
        return {
            id: notification.getId(),
            type: notification.getType(),
            channel: notification.getChannel(),
            title: notification.getTitle(),
            body: notification.getBody(),
            metadata: notification.getMetadata(),
            isRead: notification.getIsRead(),
            readAt: notification.getReadAt()?.toISOString(),
            createdAt: notification.getCreatedAt().toISOString(),
            updatedAt: notification.getUpdatedAt().toISOString(),
        };
    }
};
exports.GetNotificationsUseCase = GetNotificationsUseCase;
exports.GetNotificationsUseCase = GetNotificationsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.NotificationRepository)),
    __metadata("design:paramtypes", [Object])
], GetNotificationsUseCase);
//# sourceMappingURL=GetNotificationsUseCase.js.map