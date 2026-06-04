import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { GoogleLoginRequestDto } from "@application/dto/auth/GoogleLoginRequestDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { CookieHelper } from "@shared/utils/CookieHelper";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { SignupVerifyResponseDto } from "@application/dto/auth";
import { AuthMessages } from "@shared/constants/AuthConstants";

@injectable()
export class SocialAuthController {
  constructor(
    @inject(TYPES.GetGoogleAuthUrlUseCase)
    private getGoogleAuthUrlUseCase: IUseCase<
      void,
      Promise<Result<{ authUrl: string }>>
    >,
    @inject(TYPES.GoogleLoginUseCase)
    private googleLoginUseCase: IUseCase<
      GoogleLoginRequestDto,
      Promise<Result<SignupVerifyResponseDto & { isNewUser: boolean }>>
    >,
  ) {}

  async getGoogleAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getGoogleAuthUrlUseCase.execute();

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: AuthMessages.GOOGLE_AUTH_URL_SUCCESS,
        data,
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Google auth URL generated successfully");
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4001";

    try {
      const code = req.query.code as string;

      if (!code) {
        Logger.warn("Google login - authorization code missing");
        return res.redirect(`${frontendUrl}/login?error=missing_code`);
      }

      const dto = new GoogleLoginRequestDto({ code });
      const result = await this.googleLoginUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.error("Google login failed", {
          error: error.message,
          stack: error.stack,
        });

        // Redirect to frontend with error
        return res.redirect(`${frontendUrl}/login?error=auth_failed`);
      }

      const data = result.getValue();

      CookieHelper.setRefreshTokenCookie(res, data.refreshToken);

      const redirectUrl = new URL(`${frontendUrl}/auth/callback`);
      redirectUrl.searchParams.set("accessToken", data.accessToken);
      redirectUrl.searchParams.set("role", data.user.role);
      redirectUrl.searchParams.set("isNewUser", String(data.isNewUser));

      Logger.info("Google login successful - redirecting to callback", {
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        isNewUser: data.isNewUser,
      });

      // Redirect to frontend auth callback with access token in URL
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      Logger.error("Google login controller error", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Redirect to frontend with error
      return res.redirect(`${frontendUrl}/login?error=server_error`);
    }
  }
}
