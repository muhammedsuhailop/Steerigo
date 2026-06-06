export type UserChatCreateParams = {
    id: string;
    userId: string;
    chatRoomId: string;
};
export type UserChatData = {
    id: string;
    userId: string;
    chatRoomId: string;
    lastSeenMessageId?: string;
    unreadCount: number;
    isMuted: boolean;
    isPinned: boolean;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
};
export declare class UserChat {
    private readonly id;
    private readonly userId;
    private readonly chatRoomId;
    private lastSeenMessageId?;
    private unreadCount;
    private isMuted;
    private isPinned;
    private lastMessageAt?;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(params: UserChatCreateParams): UserChat;
    static fromData(data: UserChatData): UserChat;
    incrementUnread(): void;
    markAsRead(messageId: string): void;
    updateLastMessage(timestamp: Date): void;
    mute(): void;
    unmute(): void;
    pin(): void;
    unpin(): void;
    getId(): string;
    getUserId(): string;
    getChatRoomId(): string;
    getLastSeenMessageId(): string | undefined;
    getUnreadCount(): number;
    isMutedEnabled(): boolean;
    isPinnedEnabled(): boolean;
    getLastMessageAt(): Date | undefined;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
}
//# sourceMappingURL=UserChat.d.ts.map