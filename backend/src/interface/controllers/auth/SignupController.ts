import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { SignupRequestDto } from "@application/dto/auth/SignupRequestDto";
import { SignupVerifyDto } from "@application/dto/auth/SignupVerifyDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { CookieHelper } from "@shared/utils/CookieHelper";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { SignupVerifyResponseDto } from "@application/dto/auth";

@injectable()
export class SignupController {
  constructor(
    @inject(TYPES.SignupRequestUseCase)
    private signupRequestUseCase: IUseCase<
      SignupRequestDto,
      Promise<Result<void, Error>>
    >,
    @inject(TYPES.SignupVerifyUseCase)
    private signupVerifyUseCase: IUseCase<
      SignupVerifyDto,
      Promise<Result<SignupVerifyResponseDto, Error>>
    >
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const dto = SignupRequestDto.fromRequest(req.body);
      const result = await this.signupRequestUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "signup"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: AuthMessages.SIGNUP_SUCCESS,
        data,
      };

      res.status(HttpStatusCodes.CREATED).json(response);
      Logger.info("Signup request completed successfully", {
        email: dto.getEmailValue(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "signup"
      );
      res.status(statusCode).json(response);
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const dto = SignupVerifyDto.fromRequest(req.body);
      const result = await this.signupVerifyUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "signup_verify"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      CookieHelper.setRefreshTokenCookie(res, data.refreshToken);
      const { refreshToken: _refreshToken, ...dataWithoutRefreshToken } = data;

      const response: ApiResponse = {
        success: true,
        message: AuthMessages.SIGNUP_VERIFICATION_SUCCESS,
        data: dataWithoutRefreshToken,
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Signup verification completed successfully", {
        email: dto.getEmail(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "signup_verify"
      );
      res.status(statusCode).json(response);
    }
  }
}
