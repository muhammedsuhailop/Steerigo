import { IPasswordService } from "../../application/services/IPasswordService";
import { CryptoAdapter } from "../adapters/CryptoAdapter";
export declare class PasswordService implements IPasswordService {
    private cryptoAdapter;
    constructor(cryptoAdapter: CryptoAdapter);
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
    generateTemporaryPassword(): string;
    validatePasswordStrength(password: string): boolean;
    private getRandomChar;
}
//# sourceMappingURL=PasswordService.d.ts.map