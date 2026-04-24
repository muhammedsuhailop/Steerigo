import { injectable } from "inversify";
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

@injectable()
export class ChatRealtimeService implements IChatRealtimeService {
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
    }

    Logger.info("Emitted chat message sent event", {
      chatRoomId: payload.chatRoomId,
      messageId: payload.message.id,
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
