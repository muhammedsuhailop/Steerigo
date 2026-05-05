import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { IUserChatRepository } from "@domain/repositories/IUserChatRepository";
import { IMessageStatusRepository } from "@domain/repositories/IMessageStatusRepository";
import { SendChatMessageDto } from "@application/dto/chat/SendChatMessageDto";
import { SendChatMessageResponseDto } from "@application/dto/chat/response/SendChatMessageResponseDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { Message } from "@domain/entities/Message";
import { MessageStatus } from "@domain/entities/MessageStatus";
import { MessageType } from "@domain/value-objects/MessageType";
import { ChatRoomStatus } from "@domain/value-objects/ChatRoomStatus";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { UserChat } from "@domain/entities/UserChat";
import { CHAT_MESSAGES } from "@shared/constants/ChatMessages";
import { IChatEventBus } from "@application/services/IChatEventBus";
import { ChatMessageSentEvent } from "@application/events/ChatEvents";

@injectable()
export class SendChatMessageUseCase
  implements
    IUseCase<SendChatMessageDto, Promise<Result<SendChatMessageResponseDto>>>
{
  constructor(
    @inject(TYPES.ChatRoomRepository)
    private readonly chatRoomRepository: IChatRoomRepository,
    @inject(TYPES.MessageRepository)
    private readonly messageRepository: IMessageRepository,
    @inject(TYPES.UserChatRepository)
    private readonly userChatRepository: IUserChatRepository,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.MessageStatusRepository)
    private readonly messageStatusRepository: IMessageStatusRepository,
    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
    @inject(TYPES.ChatEventBus)
    private readonly chatEventBus: IChatEventBus,
  ) {}

  async execute(
    dto: SendChatMessageDto,
  ): Promise<Result<SendChatMessageResponseDto>> {
    try {
      const userId = dto.getUserId();
      const chatRoomId = dto.getChatRoomId();
      const content = dto.getContent();

      Logger.info("Sending chat message", { userId, chatRoomId });

      const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
      if (!chatRoom) {
        return Result.failure(ChatErrors.chatRoomNotFound(chatRoomId));
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
        return Result.failure(
          ChatErrors.unauthorizedChatAccess(chatRoomId, userId),
        );
      }
      if (chatRoom.getStatus() === ChatRoomStatus.ENDED) {
        return Result.failure(ChatErrors.chatRoomEnded(chatRoomId));
      }

      if (!content.trim()) {
        return Result.failure(ChatErrors.invalidMessageContent());
      }

      const message = Message.create({
        id: this.idGenerator.generate(),
        chatRoomId,
        senderId: userId,
        content,
        type: MessageType.TEXT,
      });

      const savedMessage = await this.messageRepository.save(message);

      chatRoom.addMessage(savedMessage.getId(), savedMessage.getCreatedAt());
      await this.chatRoomRepository.save(chatRoom);

      const participants = chatRoom.getParticipants();

      for (const participant of participants) {
        let userChat = await this.userChatRepository.findByUserIdAndChatRoomId(
          participant.userId,
          chatRoomId,
        );

        if (!userChat) {
          userChat = await this.userChatRepository.save(
            UserChat.create({
              id: this.idGenerator.generate(),
              userId: participant.userId,
              chatRoomId,
            }),
          );
        }

        userChat.updateLastMessage(savedMessage.getCreatedAt());

        if (participant.userId !== userId) {
          userChat.incrementUnread();
        } else {
          userChat.markAsRead(savedMessage.getId());
        }

        await this.userChatRepository.save(userChat);
      }

      const recipientParticipants = participants.filter(
        (participant) => participant.userId !== userId,
      );

      for (const recipient of recipientParticipants) {
        const status = MessageStatus.create({
          id: this.idGenerator.generate(),
          messageId: savedMessage.getId(),
          userId: recipient.userId,
        });

        await this.messageStatusRepository.save(status);
      }

      const event: ChatMessageSentEvent = {
        type: "ChatMessageSent",
        occurredAt: new Date(),
        payload: {
          chatRoomId: savedMessage.getChatRoomId(),
          rideId: chatRoom.getRideId(),
          senderParticipantId: senderIdToStore,
          message: {
            id: savedMessage.getId(),
            senderId: savedMessage.getSenderId(),
            content: savedMessage.getContent(),
            type: savedMessage.getType(),
            metadata: savedMessage.getMetadata(),
            createdAt: savedMessage.getCreatedAt().toISOString(),
            updatedAt: savedMessage.getUpdatedAt().toISOString(),
          },
          participants: chatRoom.getParticipants().map((participant) => ({
            userId: participant.userId,
            role: participant.role,
          })),
        },
      };

      await this.chatEventBus.publish(event);

      const response: SendChatMessageResponseDto = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.SEND_SUCCESS,
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

      return Result.success(response);
    } catch (error) {
      Logger.error("SendChatMessageUseCase failed", {
        userId: dto.getUserId(),
        chatRoomId: dto.getChatRoomId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
