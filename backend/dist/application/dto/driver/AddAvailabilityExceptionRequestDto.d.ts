import { AvailabilityExceptionType } from "../../../domain/value-objects/AvailabilityExceptionType";
import { z } from "zod";
declare const addAvailabilityExceptionSchema: z.ZodObject<{
    type: z.ZodEnum<typeof AvailabilityExceptionType>;
    reason: z.ZodOptional<z.ZodString>;
    startTime: z.ZodString;
    endTime: z.ZodString;
}, z.core.$strip>;
export declare class AddAvailabilityExceptionRequestDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestBody: unknown): AddAvailabilityExceptionRequestDto;
    getUserId(): string;
    getType(): AvailabilityExceptionType;
    getReason(): string | undefined;
    getStartTime(): Date;
    getEndTime(): Date;
    validate(): string[];
}
export { addAvailabilityExceptionSchema };
//# sourceMappingURL=AddAvailabilityExceptionRequestDto.d.ts.map