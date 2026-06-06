import { z } from "zod";
declare const markNotificationsReadSchema: z.ZodObject<{
    notificationId: z.ZodOptional<z.ZodString>;
    markAll: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare class MarkNotificationsReadDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, body: unknown);
    static fromRequest(userId: string, body: unknown): MarkNotificationsReadDto;
    getUserId(): string;
    getNotificationId(): string | undefined;
    isMarkAll(): boolean;
}
export { markNotificationsReadSchema };
//# sourceMappingURL=MarkNotificationsReadDto.d.ts.map