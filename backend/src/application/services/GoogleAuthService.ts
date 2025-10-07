export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  id_token: string;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export interface GoogleAuthService {
  generateAuthUrl(): string;
  exchangeCodeForTokens(code: string): Promise<GoogleTokens>;
  getUserProfile(accessToken: string): Promise<GoogleUserProfile>;
}
