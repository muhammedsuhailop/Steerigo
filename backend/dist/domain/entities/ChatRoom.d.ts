import { ChatRoomStatus } from "@domain/value-objects/ChatRoomStatus";
import { ChatRoomType } from "@domain/value-objects/ChatRoomType";
import { UserRole } from "@shared/constants/AuthConstants";
export type ChatParticipant = {
    userId: string;
    role: UserRole;
};
export type ChatRoomCreateParams = {
    id: string;
    type: ChatRoomType;
    rideId?: string;
    participants: ChatParticipant[];
};
export type ChatRoomData = {
    id: string;
    type: ChatRoomType;
    rideId?: string;
    participants: ChatParticipant[];
    status: ChatRoomStatus;
    lastMessageId?: string;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
};
export declare class ChatRoom {
    private readonly id;
    private readonly type;
    private readonly rideId;
    private participants;
    private status;
    private lastMessageId?;
    private lastMessageAt?;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(params: ChatRoomCreateParams): ChatRoom;
    static fromData(data: ChatRoomData): ChatRoom;
    addMessage(messageId: string, timestamp: Date): void;
    end(): void;
    isParticipant(userId: string): boolean;
    getId(): string;
    getType(): ChatRoomType;
    getRideId(): string | undefined;
    getParticipants(): ChatParticipant[];
    getStatus(): ChatRoomStatus;
    getLastMessageId(): string | undefined;
    getLastMessageAt(): Date | undefined;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
}
//# sourceMappingURL=ChatRoom.d.ts.map