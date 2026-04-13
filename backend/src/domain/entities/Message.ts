import { MessageType } from "@domain/value-objects/MessageType";

export type MessageMetadata = {
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
};

export type MessageCreateParams = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type?: MessageType;
  metadata?: MessageMetadata;
};

export type MessageData = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  metadata: MessageMetadata;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  deletedAt?: Date;
};

export class Message {
  private constructor(
    private readonly id: string,
    private readonly chatRoomId: string,
    private readonly senderId: string,

    private content: string,
    private type: MessageType,
    private metadata: MessageMetadata,

    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),

    private editedAt?: Date,
    private deletedAt?: Date,
  ) {}

  static create(params: MessageCreateParams): Message {
    if (!params.id || !params.chatRoomId || !params.senderId) {
      throw new Error("Invalid Message creation parameters");
    }

    const type = params.type ?? MessageType.TEXT;

    if (type === MessageType.TEXT && !params.content) {
      throw new Error("Text message cannot be empty");
    }

    if (type === MessageType.IMAGE && !params.metadata?.imageUrl) {
      throw new Error("Image message must have imageUrl");
    }

    if (
      type === MessageType.LOCATION &&
      (params.metadata?.latitude === undefined ||
        params.metadata?.longitude === undefined)
    ) {
      throw new Error("Location message must have latitude and longitude");
    }

    return new Message(
      params.id,
      params.chatRoomId,
      params.senderId,
      params.content,
      type,
      params.metadata ?? {},
    );
  }

  static fromData(data: MessageData): Message {
    return new Message(
      data.id,
      data.chatRoomId,
      data.senderId,
      data.content,
      data.type,
      data.metadata,
      data.createdAt,
      data.updatedAt,
      data.editedAt,
      data.deletedAt,
    );
  }

  edit(newContent: string): void {
    if (this.deletedAt) {
      throw new Error("Cannot edit deleted message");
    }

    if (!newContent) {
      throw new Error("Message content cannot be empty");
    }

    this.content = newContent;
    this.editedAt = new Date();
    this.updatedAt = new Date();
  }

  delete(): void {
    if (this.deletedAt) return;

    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  getId(): string {
    return this.id;
  }

  getChatRoomId(): string {
    return this.chatRoomId;
  }

  getSenderId(): string {
    return this.senderId;
  }

  getContent(): string {
    return this.content;
  }

  getType(): MessageType {
    return this.type;
  }

  getMetadata(): Readonly<MessageMetadata> {
    return { ...this.metadata };
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getEditedAt(): Date | undefined {
    return this.editedAt;
  }

  getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }
}
