import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ResendOtpDto } from "@application/dto/auth/ResendOtpDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";

@injectable()
export class OtpController {
  constructor(
    @inject(TYPES.ResendOtpUseCase)
    private resendOtpUseCase: IUseCase<
      ResendOtpDto,
      Promise<Result<{ expiresAt: Date }>>
    >
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

      res.status(HttpStatusCodes.OK).json(response);

      Logger.info("Resend OTP completed successfully", {
        email: dto.getEmail(),
      });
    } catch (error) {
      Logger.error("Resend OTP controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: AuthMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
