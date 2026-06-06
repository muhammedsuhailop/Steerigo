"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const inversify_1 = require("inversify");
const googleapis_1 = require("googleapis");
const Logger_1 = require("../../shared/utils/Logger");
let GoogleAuthService = class GoogleAuthService {
    constructor() {
        if (!process.env.GOOGLE_CLIENT_ID ||
            !process.env.GOOGLE_CLIENT_SECRET ||
            !process.env.GOOGLE_CALLBACK_URL) {
            throw new Error("Google OAuth environment variables are not set");
        }
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);
    }
    generateAuthUrl() {
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
            Logger_1.Logger.info("Generated Google auth URL");
            return authUrl;
        }
        catch (error) {
            Logger_1.Logger.error("Failed to generate Google auth URL", error);
            throw new Error("Failed to generate Google authentication URL");
        }
    }
    async exchangeCodeForTokens(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            if (!tokens.access_token) {
                throw new Error("No access token received from Google");
            }
            Logger_1.Logger.info("Successfully exchanged code for tokens");
            return {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || undefined,
                id_token: tokens.id_token || "",
            };
        }
        catch (error) {
            Logger_1.Logger.error("Failed to exchange code for tokens", error);
            throw new Error("Failed to authenticate with Google");
        }
    }
    async getUserProfile(accessToken) {
        try {
            this.oauth2Client.setCredentials({ access_token: accessToken });
            const oauth2 = googleapis_1.google.oauth2({
                version: "v2",
                auth: this.oauth2Client,
            });
            const { data } = await oauth2.userinfo.get();
            if (!data.email || !data.id) {
                throw new Error("Incomplete user data from Google");
            }
            Logger_1.Logger.info("Successfully fetched Google user profile", {
                email: data.email,
            });
            return {
                id: data.id,
                email: data.email,
                name: data.name || "",
                picture: data.picture ?? undefined,
                verified_email: data.verified_email || false,
            };
        }
        catch (error) {
            Logger_1.Logger.error("Failed to fetch Google user profile", error);
            throw new Error("Failed to fetch user profile from Google");
        }
    }
};
exports.GoogleAuthService = GoogleAuthService;
exports.GoogleAuthService = GoogleAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], GoogleAuthService);
//# sourceMappingURL=GoogleAuthService.js.map