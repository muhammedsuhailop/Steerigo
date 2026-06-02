import { Response } from "express";
export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    maxAge?: number;
    path?: string;
}
export declare class CookieHelper {
    static setRefreshTokenCookie(res: Response, refreshToken: string): void;
    static clearRefreshTokenCookie(res: Response): void;
    static getSecureCookieOptions(): CookieOptions;
}
//# sourceMappingURL=CookieHelper.d.ts.map