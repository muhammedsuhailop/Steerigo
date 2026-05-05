import { inject, injectable } from "inversify";
import {
  ChatMessageDeletedPayload,
  ChatMessageEditedPayload,
  ChatMessageSentPayload,
  ChatMessageViewedPayload,
} from "@application/events/ChatEvents";
import { IChatRealtimeService } from "@application/services/IChatRealtimeService";
import { SOCKET_EVENTS } from "@infrastructure/realtime/constants/SocketEvents";
import { getRideSocketServer } from "@infrastructure/realtime/socket";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { INotificationPersistenceService } from "@application/services/NotificationPersistenceService";

@injectable()
export class ChatRealtimeService implements IChatRealtimeService {
  constructor(
    @inject(TYPES.NotificationPersistenceService)
    private readonly persistence: INotificationPersistenceService,
  ) {}

  private tryGetSocketServer() {
    try {
      return getRideSocketServer();
    } catch {
      return null;
    }
  }

  async notifyMessageSent(payload: ChatMessageSentPayload): Promise<void> {
    const io = this.tryGetSocketServer();

    if (!io) {
      Logger.warn("Socket server unavailable for chat:message:sent", {
        chatRoomId: payload.chatRoomId,
      });
      return;
    }

    // Emit to chat room
    io.to(`chat:${payload.chatRoomId}`).emit(
      SOCKET_EVENTS.CHAT_MESSAGE_SENT,
      payload,
    );

    const senderParticipantId = String(payload.senderParticipantId);

    await Promise.all(
      payload.participants
        .filter(
          (participant) => String(participant.userId) !== senderParticipantId,
        )
        .map(async (participant) => {
          try {
            const result = await this.persistence.persistNotification(
              participant.userId,
              {
                type: NotificationType.NEW_MESSAGE,
                title: "New Message",
                body: payload.message.content,
                metadata: {
                  chatRoomId: payload.chatRoomId,
                  messageId: payload.message.id,
                  rideId: payload.rideId,
                },
              },
            );

            if (!result) {
              Logger.warn("Notification persistence returned null", {
                recipientId: participant.userId,
                chatRoomId: payload.chatRoomId,
              });
              return;
            }

            Logger.info("Chat notification persisted successfully", {
              notificationId: result.notificationId,
              recipientId: participant.userId,
              chatRoomId: payload.chatRoomId,
            });
          } catch (error) {
            Logger.error("Failed to persist chat notification", {
              recipientId: participant.userId,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }),
    );

    Logger.info("Completed chat message notification flow", {
      chatRoomId: payload.chatRoomId,
      messageId: payload.message.id,
      participantCount: payload.participants.length,
    });
  }

  async notifyMessageEdited(payload: ChatMessageEditedPayload): Promise<void> {
    const io = this.tryGetSocketServer();
    if (!io) {
      Logger.warn("Socket server unavailable for chat:message:edited", {
        chatRoomId: payload.chatRoomId,
        messageId: payload.messageId,
      });
      return;
    }

    io.to(`chat:${payload.chatRoomId}`).emit(
      SOCKET_EVENTS.CHAT_MESSAGE_EDITED,
      payload,
    );

    Logger.info("Emitted chat message edited event", {
      chatRoomId: payload.chatRoomId,
      messageId: payload.messageId,
    });
  }

  async notifyMessageDeleted(
    payload: ChatMessageDeletedPayload,
  ): Promise<void> {
    const io = this.tryGetSocketServer();
    if (!io) {
      Logger.warn("Socket server unavailable for chat:message:deleted", {
        chatRoomId: payload.chatRoomId,
        messageId: payload.messageId,
      });
      return;
    }

    io.to(`chat:${payload.chatRoomId}`).emit(
      SOCKET_EVENTS.CHAT_MESSAGE_DELETED,
      payload,
    );

    Logger.info("Emitted chat message deleted event", {
      chatRoomId: payload.chatRoomId,
      messageId: payload.messageId,
    });
  }

  async notifyMessageViewed(payload: ChatMessageViewedPayload): Promise<void> {
    const io = this.tryGetSocketServer();
    if (!io) {
      Logger.warn("Socket server unavailable for chat:message:viewed", {
        chatRoomId: payload.chatRoomId,
        messageId: payload.messageId,
      });
      return;
    }

    io.to(`chat:${payload.chatRoomId}`).emit(
      SOCKET_EVENTS.CHAT_MESSAGE_VIEWED,
      payload,
    );

    Logger.info("Emitted chat message viewed event", {
      chatRoomId: payload.chatRoomId,
      messageId: payload.messageId,
      viewerId: payload.viewerId,
    });
  }
}
