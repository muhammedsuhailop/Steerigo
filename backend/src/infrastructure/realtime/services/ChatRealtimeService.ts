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
import { Notification } from "@domain/entities/Notification";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";

@injectable()
export class ChatRealtimeService implements IChatRealtimeService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
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

    io.to(`chat:${payload.chatRoomId}`).emit(
      SOCKET_EVENTS.CHAT_MESSAGE_SENT,
      payload,
    );

    for (const participant of payload.participants) {
      io.to(`user:${participant.userId}`).emit(
        SOCKET_EVENTS.CHAT_MESSAGE_SENT,
        payload,
      );
      Logger.debug(`Emitted socket event to user:${participant.userId}`);
    }

    const senderParticipantId = String(payload.senderParticipantId);

    for (const participant of payload.participants) {
      const currentParticipantId = String(participant.userId);

      if (currentParticipantId === senderParticipantId) {
        Logger.debug("Skipping notification persistence for sender", {
          senderParticipantId,
        });
        continue;
      }

      try {
        const notification = Notification.create({
          id: this.idGenerator.generate(),
          recipientId: participant.userId,
          type: NotificationType.NEW_MESSAGE,
          channel: NotificationChannel.PUSH,
          title: "New Message",
          body: payload.message.content,
          metadata: {
            chatRoomId: payload.chatRoomId,
            messageId: payload.message.id,
            rideId: payload.rideId,
          },
        });

        await this.notificationRepository.save(notification);

        Logger.info("Chat notification persisted successfully", {
          notificationId: notification.getId(),
          recipientId: participant.userId,
          chatRoomId: payload.chatRoomId,
        });
      } catch (error) {
        Logger.error("Failed to persist chat notification", {
          recipientId: participant.userId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

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
