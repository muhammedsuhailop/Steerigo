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
export declare class Message {
    private readonly id;
    private readonly chatRoomId;
    private readonly senderId;
    private content;
    private type;
    private metadata;
    private readonly createdAt;
    private updatedAt;
    private editedAt?;
    private deletedAt?;
    private constructor();
    private static readonly EDIT_WINDOW_MS;
    static create(params: MessageCreateParams): Message;
    static fromData(data: MessageData): Message;
    edit(newContent: string, now?: Date): void;
    delete(): void;
    isDeleted(): boolean;
    getId(): string;
    getChatRoomId(): string;
    getSenderId(): string;
    getContent(): string;
    getType(): MessageType;
    getMetadata(): Readonly<MessageMetadata>;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
    getEditedAt(): Date | undefined;
    getDeletedAt(): Date | undefined;
    canBeEdited(now?: Date): boolean;
}
//# sourceMappingURL=Message.d.ts.map