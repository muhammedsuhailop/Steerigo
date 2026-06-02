import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { IMessageStatusRepository } from "@domain/repositories/IMessageStatusRepository";
import { IUserChatRepository } from "@domain/repositories/IUserChatRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { GetChatMessagesDto } from "@application/dto/chat/GetChatMessagesDto";
import { GetChatMessagesResponseDto } from "@application/dto/chat/response/GetChatMessagesResponseDto";
export declare class GetChatMessagesUseCase implements IUseCase<GetChatMessagesDto, Promise<Result<GetChatMessagesResponseDto>>> {
    private readonly chatRoomRepository;
    private readonly messageRepository;
    private readonly messageStatusRepository;
    private readonly userChatRepository;
    private readonly driverRepository;
    constructor(chatRoomRepository: IChatRoomRepository, messageRepository: IMessageRepository, messageStatusRepository: IMessageStatusRepository, userChatRepository: IUserChatRepository, driverRepository: IDriverRepository);
    execute(dto: GetChatMessagesDto): Promise<Result<GetChatMessagesResponseDto>>;
}
//# sourceMappingURL=GetChatMessagesUseCase.d.ts.map