"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const MessageModel_1 = require("../models/MessageModel");
const MessageMapper_1 = require("../mappers/MessageMapper");
const Logger_1 = require("../../../shared/utils/Logger");
let MessageRepositoryImpl = class MessageRepositoryImpl {
    async findById(id) {
        try {
            const doc = await MessageModel_1.MessageModel.findById(id);
            return doc ? MessageMapper_1.MessageMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding message by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await MessageModel_1.MessageModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking message existence", { id, error });
            throw error;
        }
    }
    async save(entity) {
        try {
            const data = MessageMapper_1.MessageMapper.toPersistence(entity);
            const doc = await MessageModel_1.MessageModel.findOneAndUpdate({ _id: entity.getId() }, {
                ...data,
                updatedAt: entity.getUpdatedAt(),
            }, {
                new: true,
                upsert: true,
                runValidators: true,
            });
            if (!doc) {
                throw new Error("Failed to save message");
            }
            return MessageMapper_1.MessageMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving message", {
                id: entity.getId(),
                error,
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            await MessageModel_1.MessageModel.findByIdAndDelete(id);
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting message", { id, error });
            throw error;
        }
    }
    async findByChatRoomId(chatRoomId) {
        try {
            const docs = await MessageModel_1.MessageModel.find({
                chatRoomId: new mongoose_1.Types.ObjectId(chatRoomId),
            }).sort({ createdAt: -1 });
            return docs.map(MessageMapper_1.MessageMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding messages by chatRoomId", {
                chatRoomId,
                error,
            });
            throw error;
        }
    }
    async findPaginatedByChatRoomId(chatRoomId, options) {
        try {
            const { page, limit, sortOrder, type } = options;
            const query = {
                chatRoomId: new mongoose_1.Types.ObjectId(chatRoomId),
            };
            if (type) {
                query.type = type;
            }
            const sortValue = {
                createdAt: sortOrder === "asc" ? 1 : -1,
            };
            const total = await MessageModel_1.MessageModel.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await MessageModel_1.MessageModel.find(query)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            const data = docs.map(MessageMapper_1.MessageMapper.toDomain);
            return {
                data,
                total,
                page,
                limit,
                totalPages,
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated messages", {
                chatRoomId,
                options,
                error,
            });
            throw error;
        }
    }
    async softDelete(id) {
        try {
            const now = new Date();
            await MessageModel_1.MessageModel.findByIdAndUpdate(id, {
                $set: {
                    deletedAt: now,
                    updatedAt: now,
                },
            }, {
                runValidators: true,
            }).exec();
        }
        catch (error) {
            Logger_1.Logger.error("Error soft deleting message", { id, error });
            throw error;
        }
    }
};
exports.MessageRepositoryImpl = MessageRepositoryImpl;
exports.MessageRepositoryImpl = MessageRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], MessageRepositoryImpl);
//# sourceMappingURL=MessageRepositoryImpl.js.map