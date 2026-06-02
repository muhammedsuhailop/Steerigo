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
exports.SendChatMessageUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
const ChatErrors_1 = require("@domain/errors/ChatErrors");
const Message_1 = require("@domain/entities/Message");
const MessageStatus_1 = require("@domain/entities/MessageStatus");
const MessageType_1 = require("@domain/value-objects/MessageType");
const ChatRoomStatus_1 = require("@domain/value-objects/ChatRoomStatus");
const UserChat_1 = require("@domain/entities/UserChat");
const ChatMessages_1 = require("@shared/constants/ChatMessages");
const AuthConstants_1 = require("@shared/constants/AuthConstants");
let SendChatMessageUseCase = class SendChatMessageUseCase {
    constructor(chatRoomRepository, messageRepository, userChatRepository, driverRepository, messageStatusRepository, idGenerator, chatEventBus) {
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.userChatRepository = userChatRepository;
        this.driverRepository = driverRepository;
        this.messageStatusRepository = messageStatusRepository;
        this.idGenerator = idGenerator;
        this.chatEventBus = chatEventBus;
    }
    async execute(dto) {
        try {
            const userId = dto.getUserId();
            const chatRoomId = dto.getChatRoomId();
            const content = dto.getContent();
            Logger_1.Logger.info("Sending chat message", { userId, chatRoomId });
            const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
            if (!chatRoom) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.chatRoomNotFound(chatRoomId));
            }
            let isAuthorized = chatRoom.isParticipant(userId);
            let senderIdToStore = userId;
            if (!isAuthorized) {
                const driverProfile = await this.driverRepository.findByUserId(userId);
                if (driverProfile) {
                    const driverId = driverProfile.getId();
                    if (chatRoom.isParticipant(driverId)) {
                        isAuthorized = true;
                        senderIdToStore = driverId;
                    }
                }
            }
            if (!isAuthorized) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.unauthorizedChatAccess(chatRoomId, userId));
            }
            if (chatRoom.getStatus() === ChatRoomStatus_1.ChatRoomStatus.ENDED) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.chatRoomEnded(chatRoomId));
            }
            if (!content.trim()) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.invalidMessageContent());
            }
            const message = Message_1.Message.create({
                id: this.idGenerator.generate(),
                chatRoomId,
                senderId: userId,
                content,
                type: MessageType_1.MessageType.TEXT,
            });
            const savedMessage = await this.messageRepository.save(message);
            chatRoom.addMessage(savedMessage.getId(), savedMessage.getCreatedAt());
            await this.chatRoomRepository.save(chatRoom);
            const participants = chatRoom.getParticipants();
            const driverIdsToResolve = participants
                .filter((p) => p.role === AuthConstants_1.UserRole.DRIVER &&
                String(p.userId) !== String(senderIdToStore))
                .map((p) => String(p.userId));
            const driverProfiles = driverIdsToResolve.length > 0
                ? await this.driverRepository.findByIds(driverIdsToResolve)
                : [];
            const driverIdMap = new Map();
            driverProfiles.forEach((d) => driverIdMap.set(String(d.getId()), String(d.getUserId())));
            const resolvedParticipants = participants.map((p) => {
                let authUserId = String(p.userId);
                if (p.role === AuthConstants_1.UserRole.DRIVER) {
                    authUserId =
                        String(p.userId) === String(senderIdToStore)
                            ? String(userId)
                            : driverIdMap.get(String(p.userId)) || String(p.userId);
                }
                return {
                    userId: authUserId,
                    role: p.role,
                };
            });
            for (const participant of participants) {
                let userChat = await this.userChatRepository.findByUserIdAndChatRoomId(participant.userId, chatRoomId);
                if (!userChat) {
                    userChat = await this.userChatRepository.save(UserChat_1.UserChat.create({
                        id: this.idGenerator.generate(),
                        userId: participant.userId,
                        chatRoomId,
                    }));
                }
                userChat.updateLastMessage(savedMessage.getCreatedAt());
                if (participant.userId !== userId) {
                    userChat.incrementUnread();
                }
                else {
                    userChat.markAsRead(savedMessage.getId());
                }
                await this.userChatRepository.save(userChat);
            }
            const recipientParticipants = participants.filter((participant) => participant.userId !== userId);
            for (const recipient of recipientParticipants) {
                const status = MessageStatus_1.MessageStatus.create({
                    id: this.idGenerator.generate(),
                    messageId: savedMessage.getId(),
                    userId: recipient.userId,
                });
                await this.messageStatusRepository.save(status);
            }
            const event = {
                type: "ChatMessageSent",
                occurredAt: new Date(),
                payload: {
                    chatRoomId: savedMessage.getChatRoomId(),
                    rideId: chatRoom.getRideId(),
                    senderParticipantId: userId,
                    message: {
                        id: savedMessage.getId(),
                        senderId: savedMessage.getSenderId(),
                        content: savedMessage.getContent(),
                        type: savedMessage.getType(),
                        metadata: savedMessage.getMetadata(),
                        createdAt: savedMessage.getCreatedAt().toISOString(),
                        updatedAt: savedMessage.getUpdatedAt().toISOString(),
                    },
                    participants: resolvedParticipants,
                },
            };
            await this.chatEventBus.publish(event);
            const response = {
                success: true,
                message: ChatMessages_1.CHAT_MESSAGES.MESSAGES.SEND_SUCCESS,
                data: {
                    id: savedMessage.getId(),
                    chatRoomId: savedMessage.getChatRoomId(),
                    senderId: savedMessage.getSenderId(),
                    content: savedMessage.getContent(),
                    type: savedMessage.getType(),
                    createdAt: savedMessage.getCreatedAt().toISOString(),
                    updatedAt: savedMessage.getUpdatedAt().toISOString(),
                },
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("SendChatMessageUseCase failed", {
                userId: dto.getUserId(),
                chatRoomId: dto.getChatRoomId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.SendChatMessageUseCase = SendChatMessageUseCase;
exports.SendChatMessageUseCase = SendChatMessageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.MessageRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserChatRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.MessageStatusRepository)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __param(6, (0, inversify_1.inject)(DITypes_1.TYPES.ChatEventBus)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], SendChatMessageUseCase);
//# sourceMappingURL=SendChatMessageUseCase.js.map