import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { z } from "zod";
declare const editAvailabilityExceptionSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<typeof AvailabilityExceptionType>>;
    reason: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare class EditAvailabilityExceptionRequestDto {
    private readonly userId;
    private readonly exceptionId;
    private readonly data;
    constructor(userId: string, exceptionId: string, requestData: unknown);
    static fromRequest(userId: string, exceptionId: string, requestBody: unknown): EditAvailabilityExceptionRequestDto;
    getUserId(): string;
    getExceptionId(): string;
    getType(): AvailabilityExceptionType | undefined;
    getReason(): string | undefined;
    getStartTime(): Date | undefined;
    getEndTime(): Date | undefined;
    hasChanges(): boolean;
    validate(): string[];
}
export { editAvailabilityExceptionSchema };
//# sourceMappingURL=EditAvailabilityExceptionRequestDto.d.ts.map