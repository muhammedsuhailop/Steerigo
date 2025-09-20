import { injectable } from "inversify";
import { google, Auth } from "googleapis";
import {
  IGoogleAuthService,
  GoogleTokens,
  GoogleUserProfile,
} from "@domain/services/IGoogleAuthService";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private oauth2Client: Auth.OAuth2Client;

  constructor() {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_CALLBACK_URL
    ) {
      throw new Error("Google OAuth environment variables are not set");
    }

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );
  }

  // Google OAuth2 consent screen URL

  generateAuthUrl(): string {
    try {
      const scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ];

      const authUrl = this.oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        prompt: "consent",
        state: "steerigo_auth",
      });

      Logger.info("Generated Google auth URL", authUrl);
      return authUrl;
    } catch (error) {
      Logger.error("Failed to generate Google auth URL", error);
      throw new Error("Failed to generate Google authentication URL");
    }
  }

  // Exchange the authorization code for access/refresh/id tokens

  async exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new Error("No access token received from Google");
      }

      Logger.info("Successfully exchanged code for tokens");

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || undefined,
        id_token: tokens.id_token || "",
      };
    } catch (error) {
      Logger.error("Failed to exchange code for tokens", error);
      throw new Error("Failed to authenticate with Google");
    }
  }

  async getUserProfile(accessToken: string): Promise<GoogleUserProfile> {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });

      const oauth2 = google.oauth2({
        version: "v2",
        auth: this.oauth2Client,
      });

      const { data } = await oauth2.userinfo.get();

      if (!data.email || !data.id) {
        throw new Error("Incomplete user data from Google");
      }

      Logger.info("Successfully fetched Google user profile", {
        email: data.email,
      });

      return {
        id: data.id,
        email: data.email,
        name: data.name || "",
        picture: data.picture ?? undefined,
        verified_email: data.verified_email || false,
      };
    } catch (error) {
      Logger.error("Failed to fetch Google user profile", error);
      throw new Error("Failed to fetch user profile from Google");
    }
  }
}
