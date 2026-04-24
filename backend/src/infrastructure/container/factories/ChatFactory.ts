import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { ChatRoomController } from "@interface/controllers/chat/ChatRoomController";
import { ChatMessageController } from "@interface/controllers/chat/ChatMessageController";
import { CreateRideChatRoomUseCase } from "@application/use-cases/chat/CreateRideChatRoomUseCase";
import { GetRideChatRoomUseCase } from "@application/use-cases/chat/GetRideChatRoomUseCase";
import { GetChatMessagesUseCase } from "@application/use-cases/chat/GetChatMessagesUseCase";
import { SendChatMessageUseCase } from "@application/use-cases/chat/SendChatMessageUseCase";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetChatMessagesDto } from "@application/dto/chat/GetChatMessagesDto";
import { GetChatMessagesResponseDto } from "@application/dto/chat/response/GetChatMessagesResponseDto";
import { Result } from "@shared/utils/Result";
import { SendChatMessageDto } from "@application/dto/chat/SendChatMessageDto";
import { SendChatMessageResponseDto } from "@application/dto/chat/response/SendChatMessageResponseDto";
import { CreateRideChatRoomDto } from "@application/dto/chat/CreateRideChatRoomDto";
import { CreateRideChatRoomResponseDto } from "@application/dto/chat/response/CreateRideChatRoomResponseDto";
import { GetRideChatRoomDto } from "@application/dto/chat/GetRideChatRoomDto";
import { GetRideChatRoomResponseDto } from "@application/dto/chat/response/GetRideChatRoomResponseDto";
import { EditChatMessageDto } from "@application/dto/chat/EditChatMessageDto";
import { EditChatMessageResponseDto } from "@application/dto/chat/response/EditChatMessageResponseDto";
import { EditChatMessageUseCase } from "@application/use-cases/chat/EditChatMessageUseCase";
import { DeleteChatMessageDto } from "@application/dto/chat/DeleteChatMessageDto";
import { DeleteChatMessageResponseDto } from "@application/dto/chat/response/DeleteChatMessageResponseDto";
import { DeleteChatMessageUseCase } from "@application/use-cases/chat/DeleteChatMessageUseCase";
import { IChatRealtimeService } from "@application/services/IChatRealtimeService";
import { ChatRealtimeService } from "@infrastructure/realtime/services/ChatRealtimeService";
import { IChatEventBus } from "@application/services/IChatEventBus";
import { InMemoryChatEventBus } from "@infrastructure/events/InMemoryChatEventBus";
import { MarkChatMessagesReadUseCase } from "@application/use-cases/chat/MarkChatMessagesReadUseCase";
import { MarkChatMessagesReadDto } from "@application/dto/chat/MarkChatMessagesReadDto";
import { MarkChatMessagesReadResponseDto } from "@application/dto/chat/response/MarkChatMessagesReadResponseDto";

export class ChatFactory {
  static register(container: Container): void {
    //Controllers
    container
      .bind<ChatRoomController>(TYPES.ChatRoomController)
      .to(ChatRoomController);

    container
      .bind<ChatMessageController>(TYPES.ChatMessageController)
      .to(ChatMessageController);

    container
      .bind<IChatRealtimeService>(TYPES.ChatRealtimeService)
      .to(ChatRealtimeService)
      .inSingletonScope();

    container
      .bind<IChatEventBus>(TYPES.ChatEventBus)
      .to(InMemoryChatEventBus)
      .inSingletonScope();

    //Use Cases
    container
      .bind<
        IUseCase<
          CreateRideChatRoomDto,
          Promise<Result<CreateRideChatRoomResponseDto>>
        >
      >(TYPES.CreateRideChatRoomUseCase)
      .to(CreateRideChatRoomUseCase);

    container
      .bind<
        IUseCase<
          GetRideChatRoomDto,
          Promise<Result<GetRideChatRoomResponseDto>>
        >
      >(TYPES.GetRideChatRoomUseCase)
      .to(GetRideChatRoomUseCase);

    container
      .bind<
        IUseCase<
          GetChatMessagesDto,
          Promise<Result<GetChatMessagesResponseDto>>
        >
      >(TYPES.GetChatMessagesUseCase)
      .to(GetChatMessagesUseCase);

    container
      .bind<
        IUseCase<
          SendChatMessageDto,
          Promise<Result<SendChatMessageResponseDto>>
        >
      >(TYPES.SendChatMessageUseCase)
      .to(SendChatMessageUseCase);

    container
      .bind<
        IUseCase<
          EditChatMessageDto,
          Promise<Result<EditChatMessageResponseDto>>
        >
      >(TYPES.EditChatMessageUseCase)
      .to(EditChatMessageUseCase);

    container
      .bind<
        IUseCase<
          DeleteChatMessageDto,
          Promise<Result<DeleteChatMessageResponseDto>>
        >
      >(TYPES.DeleteChatMessageUseCase)
      .to(DeleteChatMessageUseCase);

    container
      .bind<
        IUseCase<
          MarkChatMessagesReadDto,
          Promise<Result<MarkChatMessagesReadResponseDto>>
        >
      >(TYPES.MarkChatMessagesReadUseCase)
      .to(MarkChatMessagesReadUseCase);
  }
}
