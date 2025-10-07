import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ResendOtpUseCase } from "@application/use-cases/auth/ResendOtpUseCase";
import { ResendOtpDto } from "@application/dto/auth/ResendOtpDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class OtpController {
  constructor(
    @inject(TYPES.ResendOtpUseCase)
    private resendOtpUseCase: ResendOtpUseCase
  ) {}

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const dto = new ResendOtpDto(req.body);
      const result = await this.resendOtpUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "resend_otp"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: AuthMessages.OTP_RESEND_SUCCESS,
        data,
      };

      res.status(200).json(response);
      Logger.info("Resend OTP completed successfully", {
        email: dto.getEmail(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "resend_otp"
      );
      res.status(statusCode).json(response);
    }
  }
}
