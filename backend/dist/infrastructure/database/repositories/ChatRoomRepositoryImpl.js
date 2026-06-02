"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const ChatRoomModel_1 = require("../models/ChatRoomModel");
const ChatRoomMapper_1 = require("../mappers/ChatRoomMapper");
const Logger_1 = require("@shared/utils/Logger");
let ChatRoomRepositoryImpl = class ChatRoomRepositoryImpl {
    async findById(id) {
        try {
            const doc = await ChatRoomModel_1.ChatRoomModel.findById(id);
            return doc ? ChatRoomMapper_1.ChatRoomMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding chat room by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await ChatRoomModel_1.ChatRoomModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking chat room existence", { id, error });
            throw error;
        }
    }
    async save(entity) {
        try {
            const data = ChatRoomMapper_1.ChatRoomMapper.toPersistence(entity);
            const doc = await ChatRoomModel_1.ChatRoomModel.findOneAndUpdate({ _id: entity.getId() }, {
                ...data,
                updatedAt: entity.getUpdatedAt(),
            }, {
                new: true,
                upsert: true,
                runValidators: true,
            });
            if (!doc) {
                throw new Error("Failed to save chat room");
            }
            Logger_1.Logger.info("ChatRoom saved successfully", {
                id: doc._id.toString(),
                type: doc.type,
            });
            return ChatRoomMapper_1.ChatRoomMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving chat room", {
                id: entity.getId(),
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await ChatRoomModel_1.ChatRoomModel.findByIdAndDelete(id);
            if (result) {
                Logger_1.Logger.info("ChatRoom deleted", { id });
            }
            else {
                Logger_1.Logger.warn("ChatRoom not found for deletion", { id });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting chat room", { id, error });
            throw error;
        }
    }
    async findByRideId(rideId) {
        try {
            const doc = await ChatRoomModel_1.ChatRoomModel.findOne({
                rideId: rideId,
            });
            return doc ? ChatRoomMapper_1.ChatRoomMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding chat room by rideId", {
                rideId,
                error,
            });
            throw error;
        }
    }
    async findByUserId(userId) {
        try {
            const docs = await ChatRoomModel_1.ChatRoomModel.find({
                "participants.userId": new mongoose_1.Types.ObjectId(userId),
            }).sort({ lastMessageAt: -1 });
            return docs.map(ChatRoomMapper_1.ChatRoomMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding chat rooms by userId", {
                userId,
                error,
            });
            throw error;
        }
    }
    async findPaginatedByUserId(userId, options) {
        try {
            const { page, limit, sortOrder, type } = options;
            const query = {
                "participants.userId": new mongoose_1.Types.ObjectId(userId),
            };
            if (type) {
                query.type = type;
            }
            const sortValue = {
                lastMessageAt: sortOrder === "asc" ? 1 : -1,
            };
            const total = await ChatRoomModel_1.ChatRoomModel.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await ChatRoomModel_1.ChatRoomModel.find(query)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            const data = docs.map(ChatRoomMapper_1.ChatRoomMapper.toDomain);
            return {
                data,
                total,
                page,
                limit,
                totalPages,
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated chat rooms by userId", {
                userId,
                options,
                error,
            });
            throw error;
        }
    }
};
exports.ChatRoomRepositoryImpl = ChatRoomRepositoryImpl;
exports.ChatRoomRepositoryImpl = ChatRoomRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], ChatRoomRepositoryImpl);
//# sourceMappingURL=ChatRoomRepositoryImpl.js.map