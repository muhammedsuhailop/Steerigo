import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { IChatRoomRepository } from "../../../domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IUserChatRepository } from "../../../domain/repositories/IUserChatRepository";
import { IMessageStatusRepository } from "../../../domain/repositories/IMessageStatusRepository";
import { SendChatMessageDto } from "../../dto/chat/SendChatMessageDto";
import { SendChatMessageResponseDto } from "../../dto/chat/response/SendChatMessageResponseDto";
import { IIdGenerator } from "../../services/IIdGenerator";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IChatEventBus } from "../../services/IChatEventBus";
export declare class SendChatMessageUseCase implements IUseCase<SendChatMessageDto, Promise<Result<SendChatMessageResponseDto>>> {
    private readonly chatRoomRepository;
    private readonly messageRepository;
    private readonly userChatRepository;
    private readonly driverRepository;
    private readonly messageStatusRepository;
    private readonly idGenerator;
    private readonly chatEventBus;
    constructor(chatRoomRepository: IChatRoomRepository, messageRepository: IMessageRepository, userChatRepository: IUserChatRepository, driverRepository: IDriverRepository, messageStatusRepository: IMessageStatusRepository, idGenerator: IIdGenerator, chatEventBus: IChatEventBus);
    execute(dto: SendChatMessageDto): Promise<Result<SendChatMessageResponseDto>>;
}
//# sourceMappingURL=SendChatMessageUseCase.d.ts.map