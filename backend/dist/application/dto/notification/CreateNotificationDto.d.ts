import { z } from "zod";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";
declare const createNotificationSchema: z.ZodObject<{
    recipientId: z.ZodString;
    type: z.ZodEnum<typeof NotificationType>;
    channel: z.ZodEnum<typeof NotificationChannel>;
    title: z.ZodString;
    body: z.ZodString;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
export declare class CreateNotificationDto {
    private readonly data;
    constructor(input: unknown);
    static fromPayload(input: unknown): CreateNotificationDto;
    getRecipientId(): string;
    getType(): NotificationType;
    getChannel(): NotificationChannel;
    getTitle(): string;
    getBody(): string;
    getMetadata(): Record<string, unknown>;
}
export { createNotificationSchema };
//# sourceMappingURL=CreateNotificationDto.d.ts.map