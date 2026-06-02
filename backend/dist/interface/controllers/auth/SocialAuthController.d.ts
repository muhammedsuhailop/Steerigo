import { Request, Response } from "express";
import { GoogleLoginRequestDto } from "@application/dto/auth/GoogleLoginRequestDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { SignupVerifyResponseDto } from "@application/dto/auth";
export declare class SocialAuthController {
    private getGoogleAuthUrlUseCase;
    private googleLoginUseCase;
    constructor(getGoogleAuthUrlUseCase: IUseCase<void, Promise<Result<{
        authUrl: string;
    }>>>, googleLoginUseCase: IUseCase<GoogleLoginRequestDto, Promise<Result<SignupVerifyResponseDto & {
        isNewUser: boolean;
    }>>>);
    getGoogleAuthUrl(req: Request, res: Response): Promise<void>;
    googleLogin(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=SocialAuthController.d.ts.map