import { z } from "zod";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";
declare const getNotificationsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    isRead: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodBoolean, z.ZodEnum<{
        true: "true";
        false: "false";
    }>]>, z.ZodTransform<boolean, boolean | "true" | "false">>>;
    type: z.ZodOptional<z.ZodEnum<typeof NotificationType>>;
    channel: z.ZodOptional<z.ZodEnum<typeof NotificationChannel>>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare class GetNotificationsDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, query: unknown);
    static fromRequest(userId: string, query: unknown): GetNotificationsDto;
    getUserId(): string;
    getPage(): number;
    getLimit(): number;
    getSortOrder(): "asc" | "desc";
    getIsRead(): boolean | undefined;
    getType(): NotificationType | undefined;
    getChannel(): NotificationChannel | undefined;
    getFromDate(): Date | undefined;
    getToDate(): Date | undefined;
}
export { getNotificationsSchema };
//# sourceMappingURL=GetNotificationsDto.d.ts.map