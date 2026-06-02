export interface IGoogleTokens {
    access_token: string;
    refresh_token?: string;
    id_token: string;
}
export interface IGoogleUserProfile {
    id: string;
    email: string;
    name: string;
    picture?: string;
    verified_email: boolean;
}
export interface IGoogleAuthService {
    generateAuthUrl(): string;
    exchangeCodeForTokens(code: string): Promise<IGoogleTokens>;
    getUserProfile(accessToken: string): Promise<IGoogleUserProfile>;
}
//# sourceMappingURL=IGoogleAuthService.d.ts.map