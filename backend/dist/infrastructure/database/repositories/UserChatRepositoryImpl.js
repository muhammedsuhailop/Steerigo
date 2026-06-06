"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChatRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const UserChatMapper_1 = require("../mappers/UserChatMapper");
const Logger_1 = require("../../../shared/utils/Logger");
const UserChatMode_1 = require("../models/UserChatMode");
let UserChatRepositoryImpl = class UserChatRepositoryImpl {
    async findById(id) {
        try {
            const doc = await UserChatMode_1.UserChatModel.findById(id);
            return doc ? UserChatMapper_1.UserChatMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding user chat by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await UserChatMode_1.UserChatModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking user chat existence", { id, error });
            throw error;
        }
    }
    async save(entity) {
        try {
            const data = UserChatMapper_1.UserChatMapper.toPersistence(entity);
            const doc = await UserChatMode_1.UserChatModel.findOneAndUpdate({ _id: entity.getId() }, {
                ...data,
                updatedAt: entity.getUpdatedAt(),
            }, {
                new: true,
                upsert: true,
                runValidators: true,
            });
            if (!doc) {
                throw new Error("Failed to save user chat");
            }
            return UserChatMapper_1.UserChatMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving user chat", {
                id: entity.getId(),
                error,
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            await UserChatMode_1.UserChatModel.findByIdAndDelete(id);
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting user chat", { id, error });
            throw error;
        }
    }
    async findByUserId(userId) {
        try {
            const docs = await UserChatMode_1.UserChatModel.find({
                userId: new mongoose_1.Types.ObjectId(userId),
            }).sort({ lastMessageAt: -1 });
            return docs.map(UserChatMapper_1.UserChatMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding user chats by userId", {
                userId,
                error,
            });
            throw error;
        }
    }
    async findByUserIdAndChatRoomId(userId, chatRoomId) {
        try {
            const doc = await UserChatMode_1.UserChatModel.findOne({
                userId: new mongoose_1.Types.ObjectId(userId),
                chatRoomId: new mongoose_1.Types.ObjectId(chatRoomId),
            });
            return doc ? UserChatMapper_1.UserChatMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding user chat by userId & chatRoomId", {
                userId,
                chatRoomId,
                error,
            });
            throw error;
        }
    }
    async findPaginatedByUserId(userId, options) {
        try {
            const { page, limit, sortOrder } = options;
            const query = {
                userId: new mongoose_1.Types.ObjectId(userId),
            };
            const sortValue = {
                lastMessageAt: sortOrder === "asc" ? 1 : -1,
            };
            const total = await UserChatMode_1.UserChatModel.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await UserChatMode_1.UserChatModel.find(query)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            const data = docs.map(UserChatMapper_1.UserChatMapper.toDomain);
            return {
                data,
                total,
                page,
                limit,
                totalPages,
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated user chats", {
                userId,
                options,
                error,
            });
            throw error;
        }
    }
    async getTotalUnreadCountByUserId(userId) {
        try {
            const result = await UserChatMode_1.UserChatModel.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.Types.ObjectId(userId),
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalUnreadCount: { $sum: "$unreadCount" },
                    },
                },
            ]);
            return result[0]?.totalUnreadCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error getting total unread count by userId", {
                userId,
                error,
            });
            throw error;
        }
    }
    async markChatAsRead(userId, chatRoomId, lastReadMessageId, readAt) {
        try {
            const existingDoc = await UserChatMode_1.UserChatModel.findOne({
                userId: new mongoose_1.Types.ObjectId(userId),
                chatRoomId: new mongoose_1.Types.ObjectId(chatRoomId),
            });
            if (!existingDoc) {
                Logger_1.Logger.warn("UserChat not found while marking chat as read", {
                    userId,
                    chatRoomId,
                    lastReadMessageId,
                });
                return null;
            }
            const userChat = UserChatMapper_1.UserChatMapper.toDomain(existingDoc);
            userChat.markAsRead(lastReadMessageId);
            const persistenceData = UserChatMapper_1.UserChatMapper.toPersistence(userChat);
            const updatedDoc = await UserChatMode_1.UserChatModel.findByIdAndUpdate(existingDoc._id, {
                ...persistenceData,
                updatedAt: readAt,
            }, {
                new: true,
                runValidators: true,
            });
            if (!updatedDoc) {
                Logger_1.Logger.warn("Failed to update UserChat while marking as read", {
                    userId,
                    chatRoomId,
                    lastReadMessageId,
                });
                return null;
            }
            return UserChatMapper_1.UserChatMapper.toDomain(updatedDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error marking chat as read", {
                userId,
                chatRoomId,
                lastReadMessageId,
                error,
            });
            throw error;
        }
    }
};
exports.UserChatRepositoryImpl = UserChatRepositoryImpl;
exports.UserChatRepositoryImpl = UserChatRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], UserChatRepositoryImpl);
//# sourceMappingURL=UserChatRepositoryImpl.js.map