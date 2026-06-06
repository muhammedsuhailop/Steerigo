import { MessageDeliveryStatus } from "../value-objects/MessageDeliveryStatus";
export type MessageStatusCreateParams = {
    id: string;
    messageId: string;
    userId: string;
};
export type MessageStatusData = {
    id: string;
    messageId: string;
    userId: string;
    status: MessageDeliveryStatus;
    createdAt: Date;
    updatedAt: Date;
};
export declare class MessageStatus {
    private readonly id;
    private readonly messageId;
    private readonly userId;
    private status;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(params: MessageStatusCreateParams): MessageStatus;
    static fromData(data: MessageStatusData): MessageStatus;
    markDelivered(): void;
    markRead(): void;
    getId(): string;
    getMessageId(): string;
    getUserId(): string;
    getStatus(): MessageDeliveryStatus;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
}
//# sourceMappingURL=MessageStatus.d.ts.map