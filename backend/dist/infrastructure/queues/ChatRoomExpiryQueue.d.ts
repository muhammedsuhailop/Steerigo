import { Queue } from "bullmq";
export interface ChatRoomExpiryJobData {
    rideId: string;
    chatRoomId: string;
}
export declare const createChatRoomExpiryQueue: () => Queue<ChatRoomExpiryJobData>;
//# sourceMappingURL=ChatRoomExpiryQueue.d.ts.map