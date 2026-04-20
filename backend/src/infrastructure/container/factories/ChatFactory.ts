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

export class ChatFactory {
  static register(container: Container): void {
    //Controllers
    container
      .bind<ChatRoomController>(TYPES.ChatRoomController)
      .to(ChatRoomController);

    container
      .bind<ChatMessageController>(TYPES.ChatMessageController)
      .to(ChatMessageController);

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
  }
}
