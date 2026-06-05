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
exports.DeleteChatMessageUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ChatErrors_1 = require("../../../domain/errors/ChatErrors");
let DeleteChatMessageUseCase = class DeleteChatMessageUseCase {
    constructor(messageRepository, chatEventBus) {
        this.messageRepository = messageRepository;
        this.chatEventBus = chatEventBus;
    }
    async execute(dto) {
        try {
            const userId = dto.getUserId();
            const messageId = dto.getMessageId();
            Logger_1.Logger.info("Deleting chat message", { userId, messageId });
            const message = await this.messageRepository.findById(messageId);
            if (!message) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.messageNotFound(messageId));
            }
            if (message.getSenderId() !== userId) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.unauthorizedMessageAccess(messageId, userId));
            }
            if (message.isDeleted()) {
                const response = {
                    id: message.getId(),
                    chatRoomId: message.getChatRoomId(),
                    senderId: message.getSenderId(),
                    deletedAt: message.getDeletedAt().toISOString(),
                    isDeleted: true,
                };
                return Result_1.Result.success(response);
            }
            await this.messageRepository.softDelete(messageId);
            const deletedAt = new Date();
            const event = {
                type: "ChatMessageDeleted",
                occurredAt: deletedAt,
                payload: {
                    chatRoomId: message.getChatRoomId(),
                    messageId: message.getId(),
                    senderId: message.getSenderId(),
                    deletedAt: deletedAt.toISOString(),
                },
            };
            await this.chatEventBus.publish(event);
            const response = {
                id: message.getId(),
                chatRoomId: message.getChatRoomId(),
                senderId: message.getSenderId(),
                deletedAt: deletedAt.toISOString(),
                isDeleted: true,
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("DeleteChatMessageUseCase failed", {
                userId: dto.getUserId(),
                messageId: dto.getMessageId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.DeleteChatMessageUseCase = DeleteChatMessageUseCase;
exports.DeleteChatMessageUseCase = DeleteChatMessageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.MessageRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.ChatEventBus)),
    __metadata("design:paramtypes", [Object, Object])
], DeleteChatMessageUseCase);
//# sourceMappingURL=DeleteChatMessageUseCase.js.map