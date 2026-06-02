export interface IOtpService {
    generate(): string;
    hash(otp: string): Promise<string>;
    verify(otp: string, hashedOtp: string): Promise<boolean>;
    isExpired(createdAt: Date, ttlSeconds?: number): boolean;
}
//# sourceMappingURL=IOtpService.d.ts.map