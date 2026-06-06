import { IChatRoomRepository } from "../../domain/repositories/IChatRoomRepository";
export declare class ChatRoomExpiryWorker {
    private readonly chatRoomRepository;
    private worker?;
    constructor(chatRoomRepository: IChatRoomRepository);
    start(): void;
    close(): Promise<void>;
    private process;
    private handleChatRoomEnd;
}
//# sourceMappingURL=ChatRoomExpiryWorker.d.ts.map