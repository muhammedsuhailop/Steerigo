import { IGoogleAuthService, IGoogleTokens, IGoogleUserProfile } from "../../application/services/IGoogleAuthService";
export declare class GoogleAuthService implements IGoogleAuthService {
    private oauth2Client;
    constructor();
    generateAuthUrl(): string;
    exchangeCodeForTokens(code: string): Promise<IGoogleTokens>;
    getUserProfile(accessToken: string): Promise<IGoogleUserProfile>;
}
//# sourceMappingURL=GoogleAuthService.d.ts.map