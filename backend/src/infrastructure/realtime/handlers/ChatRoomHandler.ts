import { Socket } from "socket.io";
import { SOCKET_EVENTS } from "../constants/SocketEvents";
import { Logger } from "@shared/utils/Logger";
import { MarkChatMessagesReadResponseDto } from "@application/dto/chat/response/MarkChatMessagesReadResponseDto";
import { MarkChatMessagesReadDto } from "@application/dto/chat/MarkChatMessagesReadDto";
import { container } from "@infrastructure/container/DIContainer";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";

export function registerChatRoomHandlers(socket: Socket): void {
  const { userId, role } = socket.data;

  const markChatMessagesReadUseCase = container.get<
    IUseCase<
      MarkChatMessagesReadDto,
      Promise<Result<MarkChatMessagesReadResponseDto>>
    >
  >(TYPES.MarkChatMessagesReadUseCase);

  socket.on(SOCKET_EVENTS.CHAT_JOIN, (chatRoomId: string) => {
    if (!chatRoomId) {
      return;
    }

    socket.join(`chat:${chatRoomId}`);

    Logger.info("Socket joined chat room", {
      socketId: socket.id,
      userId,
      role,
      chatRoomId,
    });
  });

  socket.on(SOCKET_EVENTS.CHAT_LEAVE, (chatRoomId: string) => {
    if (!chatRoomId) {
      return;
    }

    socket.leave(`chat:${chatRoomId}`);

    Logger.info("Socket left chat room", {
      socketId: socket.id,
      userId,
      role,
      chatRoomId,
    });
  });

  socket.on(
    SOCKET_EVENTS.CHAT_MESSAGE_VIEWED,
    async (
      payload: unknown,
      ack?: (
        response:
          | MarkChatMessagesReadResponseDto
          | { success: false; message: string },
      ) => void,
    ) => {
      try {
        const dto = MarkChatMessagesReadDto.fromSocketPayload(userId, payload);

        const result = await markChatMessagesReadUseCase.execute(dto);

        if (result.isSuccessful()) {
          if (typeof ack === "function") {
            ack(result.getValue());
          }
          return;
        }

        if (typeof ack === "function") {
          const error = result.getError();

          ack({
            success: false,
            message: error.message,
          });
        }
      } catch (error) {
        Logger.error("Failed to handle chat message viewed event", {
          socketId: socket.id,
          userId,
          role,
          payload,
          error: error instanceof Error ? error.message : String(error),
        });

        if (typeof ack === "function") {
          ack({
            success: false,
            message: "Failed to mark chat message as read",
          });
        }
      }
    },
  );
}
