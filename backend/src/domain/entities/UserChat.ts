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

export class UserChat {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly chatRoomId: string,

    private lastSeenMessageId?: string,
    private unreadCount: number = 0,

    private isMuted: boolean = false,
    private isPinned: boolean = false,

    private lastMessageAt?: Date,

    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static create(params: UserChatCreateParams): UserChat {
    if (!params.id || !params.userId || !params.chatRoomId) {
      throw new Error("Invalid UserChat creation parameters");
    }

    return new UserChat(params.id, params.userId, params.chatRoomId);
  }

  static fromData(data: UserChatData): UserChat {
    return new UserChat(
      data.id,
      data.userId,
      data.chatRoomId,
      data.lastSeenMessageId,
      data.unreadCount,
      data.isMuted,
      data.isPinned,
      data.lastMessageAt,
      data.createdAt,
      data.updatedAt,
    );
  }

  incrementUnread(): void {
    this.unreadCount += 1;
    this.updatedAt = new Date();
  }

  markAsRead(messageId: string): void {
    if (!messageId) {
      throw new Error("MessageId is required");
    }

    this.lastSeenMessageId = messageId;
    this.unreadCount = 0;
    this.updatedAt = new Date();
  }

  updateLastMessage(timestamp: Date): void {
    this.lastMessageAt = timestamp;
    this.updatedAt = new Date();
  }

  mute(): void {
    if (this.isMuted) return;

    this.isMuted = true;
    this.updatedAt = new Date();
  }

  unmute(): void {
    if (!this.isMuted) return;

    this.isMuted = false;
    this.updatedAt = new Date();
  }

  pin(): void {
    if (this.isPinned) return;

    this.isPinned = true;
    this.updatedAt = new Date();
  }

  unpin(): void {
    if (!this.isPinned) return;

    this.isPinned = false;
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getChatRoomId(): string {
    return this.chatRoomId;
  }

  getLastSeenMessageId(): string | undefined {
    return this.lastSeenMessageId;
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }

  isMutedEnabled(): boolean {
    return this.isMuted;
  }

  isPinnedEnabled(): boolean {
    return this.isPinned;
  }

  getLastMessageAt(): Date | undefined {
    return this.lastMessageAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
