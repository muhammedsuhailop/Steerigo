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
exports.MarkChatMessagesReadUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ChatErrors_1 = require("../../../domain/errors/ChatErrors");
const MessageDeliveryStatus_1 = require("../../../domain/value-objects/MessageDeliveryStatus");
let MarkChatMessagesReadUseCase = class MarkChatMessagesReadUseCase {
    constructor(chatRoomRepository, messageRepository, userChatRepository, messageStatusRepository, driverRepository, chatEventBus) {
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.userChatRepository = userChatRepository;
        this.messageStatusRepository = messageStatusRepository;
        this.driverRepository = driverRepository;
        this.chatEventBus = chatEventBus;
    }
    async execute(dto) {
        try {
            const userId = dto.getUserId();
            const chatRoomId = dto.getChatRoomId();
            const messageId = dto.getMessageId();
            const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
            if (!chatRoom) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.chatRoomNotFound(chatRoomId));
            }
            let resolvedUserId = userId;
            let isAuthorized = chatRoom.isParticipant(userId);
            if (!isAuthorized) {
                const driverProfile = await this.driverRepository.findByUserId(userId);
                if (driverProfile) {
                    const driverId = driverProfile.getId();
                    if (chatRoom.isParticipant(driverId)) {
                        isAuthorized = true;
                        resolvedUserId = driverId;
                        Logger_1.Logger.debug("Chat read access resolved via Driver Profile", {
                            userId,
                            resolvedDriverId: driverId,
                            chatRoomId,
                        });
                    }
                }
            }
            if (!isAuthorized) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.unauthorizedChatAccess(chatRoomId, userId));
            }
            const message = await this.messageRepository.findById(messageId);
            if (!message || message.getChatRoomId() !== chatRoomId) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.messageNotFound(messageId));
            }
            if (message.getSenderId() === resolvedUserId) {
                return Result_1.Result.success({
                    success: true,
                    message: "Own message does not require read-status update",
                    data: {
                        chatRoomId,
                        messageId,
                        userId: resolvedUserId,
                        status: MessageDeliveryStatus_1.MessageDeliveryStatus.READ,
                        seenAt: new Date().toISOString(),
                        unreadCount: 0,
                        totalUnreadCount: await this.userChatRepository.getTotalUnreadCountByUserId(resolvedUserId),
                    },
                });
            }
            const seenAt = new Date();
            const updatedUserChat = await this.userChatRepository.markChatAsRead(resolvedUserId, chatRoomId, messageId, seenAt);
            const updatedMessageIds = await this.messageStatusRepository.markMessagesAsReadUpTo(chatRoomId, resolvedUserId, messageId, seenAt);
            Logger_1.Logger.info("Marked chat messages as read", {
                chatRoomId,
                messageId,
                resolvedUserId,
                updatedCount: updatedMessageIds.length,
            });
            if (updatedMessageIds.length === 0) {
                Logger_1.Logger.warn("No message status rows were updated as read", {
                    chatRoomId,
                    messageId,
                    resolvedUserId,
                });
            }
            const unreadCount = updatedUserChat
                ? updatedUserChat.getUnreadCount()
                : 0;
            const totalUnreadCount = await this.userChatRepository.getTotalUnreadCountByUserId(resolvedUserId);
            const event = {
                type: "ChatMessageViewed",
                occurredAt: seenAt,
                payload: {
                    chatRoomId,
                    messageId,
                    viewerId: resolvedUserId,
                    status: MessageDeliveryStatus_1.MessageDeliveryStatus.READ,
                    seenAt: seenAt.toISOString(),
                },
            };
            await this.chatEventBus.publish(event);
            return Result_1.Result.success({
                success: true,
                message: "Chat message marked as read",
                data: {
                    chatRoomId,
                    messageId,
                    userId: resolvedUserId,
                    status: MessageDeliveryStatus_1.MessageDeliveryStatus.READ,
                    seenAt: seenAt.toISOString(),
                    unreadCount,
                    totalUnreadCount,
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("MarkChatMessagesReadUseCase failed", {
                userId: dto.getUserId(),
                chatRoomId: dto.getChatRoomId(),
                messageId: dto.getMessageId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error instanceof Error ? error : new Error(String(error)));
        }
    }
};
exports.MarkChatMessagesReadUseCase = MarkChatMessagesReadUseCase;
exports.MarkChatMessagesReadUseCase = MarkChatMessagesReadUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.MessageRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserChatRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.MessageStatusRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.ChatEventBus)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], MarkChatMessagesReadUseCase);
//# sourceMappingURL=MarkChatMessagesReadUseCase.js.map