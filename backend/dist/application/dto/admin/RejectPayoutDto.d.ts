export declare class RejectPayoutDto {
    private readonly adminId;
    private readonly payoutId;
    private readonly reason;
    private constructor();
    static create(params: {
        adminId: string;
        payoutId: string;
        reason: string;
    }): RejectPayoutDto;
    getAdminId(): string;
    getPayoutId(): string;
    getReason(): string;
}
//# sourceMappingURL=RejectPayoutDto.d.ts.map