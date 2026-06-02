"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const NotificationModel_1 = require("@infrastructure/database/models/NotificationModel");
const NotificationMapper_1 = require("@infrastructure/database/mappers/NotificationMapper");
const Logger_1 = require("@shared/utils/Logger");
let NotificationRepositoryImpl = class NotificationRepositoryImpl {
    async save(notification) {
        try {
            const data = NotificationMapper_1.NotificationMapper.toPersistence(notification);
            const doc = await NotificationModel_1.NotificationModel.create({
                ...data,
                createdAt: notification.getCreatedAt(),
                updatedAt: notification.getUpdatedAt(),
            });
            Logger_1.Logger.info("Notification saved", {
                id: doc._id.toString(),
                recipientId: doc.recipientId.toString(),
                type: doc.type,
            });
            return NotificationMapper_1.NotificationMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving notification", {
                recipientId: notification.getRecipientId(),
                type: notification.getType(),
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async findById(id) {
        try {
            const doc = await NotificationModel_1.NotificationModel.findById(id);
            return doc ? NotificationMapper_1.NotificationMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding notification by id", { id, error });
            throw error;
        }
    }
    async findByRecipientId(recipientId, options) {
        try {
            const { page, limit, sortOrder, isRead, type, channel, fromDate, toDate, } = options;
            const query = {
                recipientId: new mongoose_1.Types.ObjectId(recipientId),
            };
            if (isRead !== undefined) {
                query.isRead = isRead;
            }
            if (type) {
                query.type = type;
            }
            if (channel) {
                query.channel = channel;
            }
            if (fromDate ?? toDate) {
                query.createdAt = {};
                if (fromDate)
                    query.createdAt.$gte = fromDate;
                if (toDate)
                    query.createdAt.$lte = toDate;
            }
            const sortValue = {
                createdAt: sortOrder === "asc" ? 1 : -1,
            };
            const total = await NotificationModel_1.NotificationModel.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await NotificationModel_1.NotificationModel.find(query)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            Logger_1.Logger.debug("Notifications fetched for recipient", {
                recipientId,
                total,
                page,
                limit,
            });
            return {
                data: docs.map(NotificationMapper_1.NotificationMapper.toDomain),
                total,
                page,
                limit,
                totalPages,
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding notifications by recipientId", {
                recipientId,
                options,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async markOneAsRead(id, recipientId) {
        try {
            const doc = await NotificationModel_1.NotificationModel.findOneAndUpdate({
                _id: new mongoose_1.Types.ObjectId(id),
                recipientId: new mongoose_1.Types.ObjectId(recipientId),
            }, {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                    updatedAt: new Date(),
                },
            }, { new: true });
            if (!doc) {
                Logger_1.Logger.warn("Notification not found for markOneAsRead", {
                    id,
                    recipientId,
                });
                return null;
            }
            Logger_1.Logger.debug("Notification marked as read", { id, recipientId });
            return NotificationMapper_1.NotificationMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error marking notification as read", {
                id,
                recipientId,
                error,
            });
            throw error;
        }
    }
    async markAllAsRead(recipientId) {
        try {
            const result = await NotificationModel_1.NotificationModel.updateMany({
                recipientId: new mongoose_1.Types.ObjectId(recipientId),
                isRead: false,
            }, {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            Logger_1.Logger.info("All notifications marked as read", {
                recipientId,
                modifiedCount: result.modifiedCount,
            });
            return result.modifiedCount;
        }
        catch (error) {
            Logger_1.Logger.error("Error marking all notifications as read", {
                recipientId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async countUnread(recipientId) {
        try {
            return await NotificationModel_1.NotificationModel.countDocuments({
                recipientId: new mongoose_1.Types.ObjectId(recipientId),
                isRead: false,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error counting unread notifications", {
                recipientId,
                error,
            });
            throw error;
        }
    }
    async deleteById(id) {
        try {
            const result = await NotificationModel_1.NotificationModel.findByIdAndDelete(id);
            if (!result) {
                Logger_1.Logger.warn("Notification not found for deletion", { id });
                return;
            }
            Logger_1.Logger.info("Notification deleted", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting notification", { id, error });
            throw error;
        }
    }
};
exports.NotificationRepositoryImpl = NotificationRepositoryImpl;
exports.NotificationRepositoryImpl = NotificationRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], NotificationRepositoryImpl);
//# sourceMappingURL=NotificationRepositoryImpl.js.map