export interface DriverActionInput {
    driverId: string;
    action: "block" | "unblock" | "inreview";
    reason?: string;
}
export declare class DriverActionDto {
    readonly driverId: string;
    readonly action: "block" | "unblock" | "inreview";
    readonly reason?: string;
    constructor(data: DriverActionInput);
    getStatusFromAction(): "Active" | "Blocked" | "InReview";
}
//# sourceMappingURL=DriverActionDto.d.ts.map