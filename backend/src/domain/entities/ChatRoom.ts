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

export class ChatRoom {
  private constructor(
    private readonly id: string,
    private readonly type: ChatRoomType,
    private readonly rideId: string | undefined,

    private participants: ChatParticipant[],
    private status: ChatRoomStatus,

    private lastMessageId?: string,
    private lastMessageAt?: Date,

    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static create(params: ChatRoomCreateParams): ChatRoom {
    if (!params.id || !params.type) {
      throw new Error("Invalid ChatRoom creation parameters");
    }

    if (!params.participants || params.participants.length < 2) {
      throw new Error("ChatRoom must have at least 2 participants");
    }

    if (params.type === ChatRoomType.RIDE && !params.rideId) {
      throw new Error("Ride chat must have rideId");
    }

    return new ChatRoom(
      params.id,
      params.type,
      params.rideId,
      [...params.participants],
      ChatRoomStatus.ACTIVE,
    );
  }

  static fromData(data: ChatRoomData): ChatRoom {
    return new ChatRoom(
      data.id,
      data.type,
      data.rideId,
      [...data.participants],
      data.status,
      data.lastMessageId,
      data.lastMessageAt,
      data.createdAt,
      data.updatedAt,
    );
  }

  addMessage(messageId: string, timestamp: Date): void {
    if (this.status === ChatRoomStatus.ENDED) {
      throw new Error("Cannot add message to ended chat");
    }

    this.lastMessageId = messageId;
    this.lastMessageAt = timestamp;
    this.updatedAt = new Date();
  }

  end(): void {
    if (this.status === ChatRoomStatus.ENDED) return;

    this.status = ChatRoomStatus.ENDED;
    this.updatedAt = new Date();
  }

  isParticipant(userId: string): boolean {
    return this.participants.some((p) => String(p.userId) === String(userId));
  }

  getId(): string {
    return this.id;
  }

  getType(): ChatRoomType {
    return this.type;
  }

  getRideId(): string | undefined {
    return this.rideId;
  }

  getParticipants(): ChatParticipant[] {
    return [...this.participants];
  }

  getStatus(): ChatRoomStatus {
    return this.status;
  }

  getLastMessageId(): string | undefined {
    return this.lastMessageId;
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
