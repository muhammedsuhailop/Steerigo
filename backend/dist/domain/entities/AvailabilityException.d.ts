import { AvailabilityExceptionType } from "../value-objects/AvailabilityExceptionType";
export interface AvailabilityException {
    id: string;
    type: AvailabilityExceptionType;
    reason?: string;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
}
export declare class AvailabilityExceptionValidator {
    static validate(exception: AvailabilityException): void;
}
//# sourceMappingURL=AvailabilityException.d.ts.map