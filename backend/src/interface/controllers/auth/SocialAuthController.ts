import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { GetGoogleAuthUrlUseCase } from "@application/use-cases/auth/GetGoogleAuthUrlUseCase";
import { GoogleLoginUseCase } from "@application/use-cases/auth/GoogleLoginUseCase";
import { GoogleLoginRequestDto } from "@application/dto/auth/GoogleLoginRequestDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class SocialAuthController {
  constructor(
    @inject(TYPES.GetGoogleAuthUrlUseCase)
    private getGoogleAuthUrlUseCase: GetGoogleAuthUrlUseCase,
    @inject(TYPES.GoogleLoginUseCase)
    private googleLoginUseCase: GoogleLoginUseCase
  ) {}

  async getGoogleAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getGoogleAuthUrlUseCase.execute();

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "google_auth_url"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: "Google auth URL generated successfully",
        data,
      };

      res.status(200).json(response);
      Logger.info("Google auth URL generated successfully");
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "google_auth_url"
      );
      res.status(statusCode).json(response);
    }
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {

      const code = req.query.code as string;
      if (!code) {
        throw new Error("Authorization code missing in query");
      }
      const dto = new GoogleLoginRequestDto({ code });
      const result = await this.googleLoginUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "google_login"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: AuthMessages.GOOGLE_AUTH_SUCCESS,
        data,
      };

      res.status(200).json(response);
      Logger.info("Google login completed successfully", {
        userId: data.user.id,
        isNewUser: data.isNewUser,
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "google_login"
      );
      res.status(statusCode).json(response);
    }
  }
}
