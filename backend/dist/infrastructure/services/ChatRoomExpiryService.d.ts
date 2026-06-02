import { Queue } from "bullmq";
import { IChatRoomExpiryService } from "@application/services/chat/IChatRoomExpiryService";
import { ChatRoomExpiryJobData } from "@infrastructure/queues/ChatRoomExpiryQueue";
export declare class ChatRoomExpiryService implements IChatRoomExpiryService {
    private readonly expiryQueue;
    constructor(expiryQueue: Queue<ChatRoomExpiryJobData>);
    scheduleChatRoomEnd(rideId: string, chatRoomId: string): Promise<void>;
    scheduleChatRoomEndAfterCancellation(rideId: string, chatRoomId: string): Promise<void>;
    cancelChatRoomEnd(chatRoomId: string): Promise<void>;
    private buildJobId;
}
//# sourceMappingURL=ChatRoomExpiryService.d.ts.map