import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { IMessageStatusRepository } from "@domain/repositories/IMessageStatusRepository";
import { IUserChatRepository } from "@domain/repositories/IUserChatRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { GetChatMessagesDto } from "@application/dto/chat/GetChatMessagesDto";
import { GetChatMessagesResponseDto } from "@application/dto/chat/response/GetChatMessagesResponseDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { CHAT_MESSAGES } from "@shared/constants/ChatMessages";
import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";
import { ChatRoom, ChatParticipant } from "@domain/entities/ChatRoom";
import { Message } from "@domain/entities/Message";
import { MessageStatus } from "@domain/entities/MessageStatus";

@injectable()
export class GetChatMessagesUseCase
  implements
    IUseCase<GetChatMessagesDto, Promise<Result<GetChatMessagesResponseDto>>>
{
  constructor(
    @inject(TYPES.ChatRoomRepository)
    private readonly chatRoomRepository: IChatRoomRepository,
    @inject(TYPES.MessageRepository)
    private readonly messageRepository: IMessageRepository,
    @inject(TYPES.MessageStatusRepository)
    private readonly messageStatusRepository: IMessageStatusRepository,
    @inject(TYPES.UserChatRepository)
    private readonly userChatRepository: IUserChatRepository,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(
    dto: GetChatMessagesDto,
  ): Promise<Result<GetChatMessagesResponseDto>> {
    try {
      const userId: string = dto.getUserId();
      const chatRoomId: string = dto.getChatRoomId();

      const chatRoom: ChatRoom | null =
        await this.chatRoomRepository.findById(chatRoomId);
      if (!chatRoom) {
        return Result.failure(ChatErrors.chatRoomNotFound(chatRoomId));
      }

      let activeParticipantId: string = userId;
      let isAuthorized: boolean = chatRoom.isParticipant(userId);

      if (!isAuthorized) {
        const driverProfile = await this.driverRepository.findByUserId(userId);
        if (driverProfile) {
          activeParticipantId = driverProfile.getId();
          isAuthorized = chatRoom.isParticipant(activeParticipantId);
        }
      }

      if (!isAuthorized) {
        return Result.failure(
          ChatErrors.unauthorizedChatAccess(chatRoomId, userId),
        );
      }

      const paginatedMessages =
        await this.messageRepository.findPaginatedByChatRoomId(chatRoomId, {
          page: dto.getPage(),
          limit: dto.getLimit(),
          sortOrder: dto.getSortOrder(),
        });

      const participants: ChatParticipant[] = chatRoom.getParticipants();
      const otherParticipant: ChatParticipant | undefined = participants.find(
        (p) => p.userId !== activeParticipantId,
      );
      const otherParticipantId: string | undefined = otherParticipant?.userId;

      const messageIds: string[] = paginatedMessages.data.map((m: Message) =>
        m.getId(),
      );

      const [myStatuses, theirStatuses]: [MessageStatus[], MessageStatus[]] =
        await Promise.all([
          this.messageStatusRepository.findByMessageIdsAndUserId(
            messageIds,
            activeParticipantId,
          ),
          otherParticipantId
            ? this.messageStatusRepository.findByMessageIdsAndUserId(
                messageIds,
                otherParticipantId,
              )
            : Promise.resolve([]),
        ]);

      const statusMap = new Map<string, MessageDeliveryStatus>();

      myStatuses.forEach((s: MessageStatus) =>
        statusMap.set(
          `${s.getMessageId()}_${activeParticipantId}`,
          s.getStatus(),
        ),
      );

      if (otherParticipantId) {
        theirStatuses.forEach((s: MessageStatus) =>
          statusMap.set(
            `${s.getMessageId()}_${otherParticipantId}`,
            s.getStatus(),
          ),
        );
      }

      const userChat = await this.userChatRepository.findByUserIdAndChatRoomId(
        userId,
        chatRoomId,
      );
      const totalUnreadCount: number =
        await this.userChatRepository.getTotalUnreadCountByUserId(userId);

      const response: GetChatMessagesResponseDto = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.FETCHED,
        data: {
          messages: paginatedMessages.data.map((message: Message) => {
            const senderId: string = message.getSenderId();
            const messageId: string = message.getId();

            const relevantUserId: string | undefined =
              senderId === activeParticipantId
                ? otherParticipantId
                : activeParticipantId;

            const status: MessageDeliveryStatus | undefined = relevantUserId
              ? statusMap.get(`${messageId}_${relevantUserId}`)
              : undefined;

            return {
              id: messageId,
              chatRoomId: message.getChatRoomId(),
              senderId: senderId,
              content: message.getContent(),
              type: message.getType(),
              createdAt: message.getCreatedAt().toISOString(),
              updatedAt: message.getUpdatedAt().toISOString(),
              isDeleted: message.isDeleted(),
              messageStatus: status ? { status } : null,
            };
          }),
          unreadCount: userChat ? userChat.getUnreadCount() : 0,
          totalUnreadCount,
          pagination: {
            total: paginatedMessages.total,
            page: paginatedMessages.page,
            limit: paginatedMessages.limit,
            totalPages: paginatedMessages.totalPages,
          },
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("GetChatMessagesUseCase failed", { error });
      return Result.failure(error as Error);
    }
  }
}
