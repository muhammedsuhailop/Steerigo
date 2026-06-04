import { IOtpService } from "../../application/services/IOtpService";
export declare class OtpService implements IOtpService {
    generate(): string;
    hash(otp: string): Promise<string>;
    verify(otp: string, hashedOtp: string): Promise<boolean>;
    isExpired(createdAt: Date, ttlSeconds?: number): boolean;
}
//# sourceMappingURL=OtpService.d.ts.map