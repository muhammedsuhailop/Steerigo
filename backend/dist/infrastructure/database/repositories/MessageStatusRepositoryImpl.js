"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatusRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const MessageDeliveryStatus_1 = require("../../../domain/value-objects/MessageDeliveryStatus");
const MessageStatusModel_1 = require("../models/MessageStatusModel");
const MessageStatusMapper_1 = require("../mappers/MessageStatusMapper");
const Logger_1 = require("../../../shared/utils/Logger");
const MessageModel_1 = require("../models/MessageModel");
let MessageStatusRepositoryImpl = class MessageStatusRepositoryImpl {
    async findById(id) {
        try {
            const doc = await MessageStatusModel_1.MessageStatusModel.findById(id);
            return doc ? MessageStatusMapper_1.MessageStatusMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding message status by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await MessageStatusModel_1.MessageStatusModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking message status existence", { id, error });
            throw error;
        }
    }
    async save(entity) {
        try {
            const data = MessageStatusMapper_1.MessageStatusMapper.toPersistence(entity);
            const doc = await MessageStatusModel_1.MessageStatusModel.findOneAndUpdate({ _id: entity.getId() }, {
                ...data,
                updatedAt: entity.getUpdatedAt(),
            }, {
                new: true,
                upsert: true,
                runValidators: true,
            });
            if (!doc) {
                throw new Error("Failed to save message status");
            }
            return MessageStatusMapper_1.MessageStatusMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving message status", {
                id: entity.getId(),
                error,
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            await MessageStatusModel_1.MessageStatusModel.findByIdAndDelete(id);
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting message status", { id, error });
            throw error;
        }
    }
    async findByMessageId(messageId) {
        try {
            const docs = await MessageStatusModel_1.MessageStatusModel.find({
                messageId: new mongoose_1.Types.ObjectId(messageId),
            });
            return docs.map(MessageStatusMapper_1.MessageStatusMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding message statuses by messageId", {
                messageId,
                error,
            });
            throw error;
        }
    }
    async findByMessageIdAndUserId(messageId, userId) {
        try {
            const doc = await MessageStatusModel_1.MessageStatusModel.findOne({
                messageId: new mongoose_1.Types.ObjectId(messageId),
                userId: new mongoose_1.Types.ObjectId(userId),
            });
            return doc ? MessageStatusMapper_1.MessageStatusMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding message status by messageId & userId", {
                messageId,
                userId,
                error,
            });
            throw error;
        }
    }
    async findByMessageIdsAndUserId(messageIds, userId) {
        try {
            if (messageIds.length === 0) {
                return [];
            }
            const objectIds = messageIds.map((messageId) => new mongoose_1.Types.ObjectId(messageId));
            const docs = await MessageStatusModel_1.MessageStatusModel.find({
                messageId: { $in: objectIds },
                userId: new mongoose_1.Types.ObjectId(userId),
            });
            return docs.map(MessageStatusMapper_1.MessageStatusMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding message statuses by messageIds & userId", {
                messageIds,
                userId,
                error,
            });
            throw error;
        }
    }
    async updateStatus(messageId, userId, status) {
        try {
            const filter = {
                messageId: new mongoose_1.Types.ObjectId(messageId),
                userId: new mongoose_1.Types.ObjectId(userId),
            };
            const updateData = {
                status,
                updatedAt: new Date(),
            };
            await MessageStatusModel_1.MessageStatusModel.updateOne(filter, updateData);
        }
        catch (error) {
            Logger_1.Logger.error("Error updating message status", {
                messageId,
                userId,
                status,
                error,
            });
            throw error;
        }
    }
    async markMessagesAsReadUpTo(chatRoomId, userId, messageId, readAt) {
        try {
            const boundaryMessage = await MessageModel_1.MessageModel.findById(new mongoose_1.Types.ObjectId(messageId)).select({
                _id: 1,
                chatRoomId: 1,
                createdAt: 1,
            });
            if (!boundaryMessage) {
                Logger_1.Logger.warn("Boundary message not found for markMessagesAsReadUpTo", {
                    chatRoomId,
                    userId,
                    messageId,
                });
                return [];
            }
            if (boundaryMessage.chatRoomId.toString() !== chatRoomId) {
                Logger_1.Logger.warn("Boundary message does not belong to chat room", {
                    chatRoomId,
                    userId,
                    messageId,
                    actualChatRoomId: boundaryMessage.chatRoomId.toString(),
                });
                return [];
            }
            const messagesInRange = await MessageModel_1.MessageModel.find({
                chatRoomId: new mongoose_1.Types.ObjectId(chatRoomId),
                createdAt: { $lte: boundaryMessage.createdAt },
            }).select({ _id: 1 });
            const messageObjectIds = messagesInRange.map((message) => message._id);
            if (messageObjectIds.length === 0) {
                return [];
            }
            await MessageStatusModel_1.MessageStatusModel.updateMany({
                messageId: { $in: messageObjectIds },
                userId: new mongoose_1.Types.ObjectId(userId),
                status: { $ne: MessageDeliveryStatus_1.MessageDeliveryStatus.READ },
            }, {
                $set: {
                    status: MessageDeliveryStatus_1.MessageDeliveryStatus.READ,
                    readAt,
                    updatedAt: readAt,
                },
            });
            return messageObjectIds.map((id) => id.toString());
        }
        catch (error) {
            Logger_1.Logger.error("Error marking messages as read up to boundary", {
                chatRoomId,
                userId,
                messageId,
                error,
            });
            throw error;
        }
    }
};
exports.MessageStatusRepositoryImpl = MessageStatusRepositoryImpl;
exports.MessageStatusRepositoryImpl = MessageStatusRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], MessageStatusRepositoryImpl);
//# sourceMappingURL=MessageStatusRepositoryImpl.js.map