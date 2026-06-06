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
exports.NotificationController = void 0;
const inversify_1 = require("inversify");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const NotificationMessages_1 = require("../../../shared/constants/NotificationMessages");
const GetNotificationsDto_1 = require("../../../application/dto/notification/GetNotificationsDto");
const MarkNotificationsReadDto_1 = require("../../../application/dto/notification/MarkNotificationsReadDto");
let NotificationController = class NotificationController {
    constructor(getNotificationsUseCase, markNotificationsReadUseCase) {
        this.getNotificationsUseCase = getNotificationsUseCase;
        this.markNotificationsReadUseCase = markNotificationsReadUseCase;
    }
    getUserId(req) {
        return req.user?.userId ?? null;
    }
    async getNotifications(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Get notifications request received", { userId });
            const queryData = {
                page: req.query.page ? parseInt(req.query.page, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit, 10) : 20,
                sortOrder: req.query.sortOrder,
                isRead: req.query.isRead,
                type: req.query.type,
                channel: req.query.channel,
                fromDate: req.query.fromDate,
                toDate: req.query.toDate,
            };
            const dto = GetNotificationsDto_1.GetNotificationsDto.fromRequest(userId, queryData);
            const result = await this.getNotificationsUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Get notifications failed", {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Notifications fetched successfully", {
                userId,
                total: responseData.pagination.total,
                unreadCount: responseData.unreadCount,
            });
            const response = {
                success: true,
                message: NotificationMessages_1.NOTIFICATION_MESSAGES.FETCHED_SUCCESSFULLY,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get notifications controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async markAsRead(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Mark notifications as read request received", { userId });
            const dto = MarkNotificationsReadDto_1.MarkNotificationsReadDto.fromRequest(userId, req.body);
            const result = await this.markNotificationsReadUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Mark notifications as read failed", {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Notifications marked as read successfully", {
                userId,
                updatedCount: responseData.updatedCount,
            });
            const response = {
                success: true,
                message: NotificationMessages_1.NOTIFICATION_MESSAGES.MARKED_AS_READ,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Mark notifications as read controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.NotificationController = NotificationController;
exports.NotificationController = NotificationController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetNotificationsUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.MarkNotificationsReadUseCase)),
    __metadata("design:paramtypes", [Object, Object])
], NotificationController);
//# sourceMappingURL=NotificationController.js.map