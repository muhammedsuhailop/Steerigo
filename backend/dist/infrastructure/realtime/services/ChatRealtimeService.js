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
exports.ChatRealtimeService = void 0;
const inversify_1 = require("inversify");
const SocketEvents_1 = require("../../realtime/constants/SocketEvents");
const socket_1 = require("../../realtime/socket");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const NotificationType_1 = require("../../../domain/value-objects/NotificationType");
let ChatRealtimeService = class ChatRealtimeService {
    constructor(persistence) {
        this.persistence = persistence;
    }
    tryGetSocketServer() {
        try {
            return (0, socket_1.getRideSocketServer)();
        }
        catch {
            return null;
        }
    }
    async notifyMessageSent(payload) {
        const io = this.tryGetSocketServer();
        if (!io) {
            Logger_1.Logger.warn("Socket server unavailable for chat:message:sent", {
                chatRoomId: payload.chatRoomId,
            });
            return;
        }
        // Emit to chat room
        io.to(`chat:${payload.chatRoomId}`).emit(SocketEvents_1.SOCKET_EVENTS.CHAT_MESSAGE_SENT, payload);
        const senderParticipantId = String(payload.senderParticipantId);
        await Promise.all(payload.participants
            .filter((participant) => String(participant.userId) !== senderParticipantId)
            .map(async (participant) => {
            try {
                const result = await this.persistence.persistNotification(participant.userId, {
                    type: NotificationType_1.NotificationType.NEW_MESSAGE,
                    title: "New Message",
                    body: payload.message.content,
                    metadata: {
                        chatRoomId: payload.chatRoomId,
                        messageId: payload.message.id,
                        rideId: payload.rideId,
                    },
                });
                if (!result) {
                    Logger_1.Logger.warn("Notification persistence returned null", {
                        recipientId: participant.userId,
                        chatRoomId: payload.chatRoomId,
                    });
                    return;
                }
                Logger_1.Logger.info("Chat notification persisted successfully", {
                    notificationId: result.notificationId,
                    recipientId: participant.userId,
                    chatRoomId: payload.chatRoomId,
                });
            }
            catch (error) {
                Logger_1.Logger.error("Failed to persist chat notification", {
                    recipientId: participant.userId,
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }));
        Logger_1.Logger.info("Completed chat message notification flow", {
            chatRoomId: payload.chatRoomId,
            messageId: payload.message.id,
            participantCount: payload.participants.length,
        });
    }
    async notifyMessageEdited(payload) {
        const io = this.tryGetSocketServer();
        if (!io) {
            Logger_1.Logger.warn("Socket server unavailable for chat:message:edited", {
                chatRoomId: payload.chatRoomId,
                messageId: payload.messageId,
            });
            return;
        }
        io.to(`chat:${payload.chatRoomId}`).emit(SocketEvents_1.SOCKET_EVENTS.CHAT_MESSAGE_EDITED, payload);
        Logger_1.Logger.info("Emitted chat message edited event", {
            chatRoomId: payload.chatRoomId,
            messageId: payload.messageId,
        });
    }
    async notifyMessageDeleted(payload) {
        const io = this.tryGetSocketServer();
        if (!io) {
            Logger_1.Logger.warn("Socket server unavailable for chat:message:deleted", {
                chatRoomId: payload.chatRoomId,
                messageId: payload.messageId,
            });
            return;
        }
        io.to(`chat:${payload.chatRoomId}`).emit(SocketEvents_1.SOCKET_EVENTS.CHAT_MESSAGE_DELETED, payload);
        Logger_1.Logger.info("Emitted chat message deleted event", {
            chatRoomId: payload.chatRoomId,
            messageId: payload.messageId,
        });
    }
    async notifyMessageViewed(payload) {
        const io = this.tryGetSocketServer();
        if (!io) {
            Logger_1.Logger.warn("Socket server unavailable for chat:message:viewed", {
                chatRoomId: payload.chatRoomId,
                messageId: payload.messageId,
            });
            return;
        }
        io.to(`chat:${payload.chatRoomId}`).emit(SocketEvents_1.SOCKET_EVENTS.CHAT_MESSAGE_VIEWED, payload);
        Logger_1.Logger.info("Emitted chat message viewed event", {
            chatRoomId: payload.chatRoomId,
            messageId: payload.messageId,
            viewerId: payload.viewerId,
        });
    }
};
exports.ChatRealtimeService = ChatRealtimeService;
exports.ChatRealtimeService = ChatRealtimeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.NotificationPersistenceService)),
    __metadata("design:paramtypes", [Object])
], ChatRealtimeService);
//# sourceMappingURL=ChatRealtimeService.js.map