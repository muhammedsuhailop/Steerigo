import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import {
  GoogleLoginUseCase,
  GetGoogleAuthUrlUseCase,
} from "@application/use-cases";
import { GoogleLoginDto } from "@application/dto/auth";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class SocialAuthController {
  constructor(
    @inject(GetGoogleAuthUrlUseCase)
    private getGoogleAuthUrlUseCase: GetGoogleAuthUrlUseCase,
    @inject(GoogleLoginUseCase) private googleLoginUseCase: GoogleLoginUseCase
  ) {}

  async getGoogleAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getGoogleAuthUrlUseCase.execute();

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_google_auth_url"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Google auth URL generated successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_google_auth_url"
      );
      res.status(statusCode).json(response);
    }
  }

  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GoogleLoginDto(req.query);
      const result = await this.googleLoginUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        // For OAuth callback, redirect to frontend with error
        const frontendUrl = `${process.env.FRONTEND_URL}/login?error=authentication_failed`;
        res.redirect(frontendUrl);
        return;
      }

      const data = result.getValue();
      const frontendUrl =
        `${process.env.FRONTEND_URL}/auth/callback?` +
        `accessToken=${encodeURIComponent(data.accessToken)}` +
        `&refreshToken=${encodeURIComponent(data.refreshToken)}` +
        `&isNewUser=${data.isNewUser}`;

      res.redirect(frontendUrl);
      Logger.info("Google login completed successfully", {
        email: data.user.email,
        isNewUser: data.isNewUser,
      });
    } catch (error) {
      Logger.error("Error in Google callback", error);
      const frontendUrl = `${process.env.FRONTEND_URL}/login?error=authentication_failed`;
      res.redirect(frontendUrl);
    }
  }
}
