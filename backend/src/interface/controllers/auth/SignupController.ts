import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { SignupRequestUseCase } from "@application/use-cases/auth/SignupRequestUseCase";
import { SignupVerifyUseCase } from "@application/use-cases/auth/SignupVerifyUseCase";
import { SignupRequestDto, SignupVerifyDto } from "@application/dto/auth";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class SignupController {
  constructor(
    @inject(SignupRequestUseCase)
    private signupRequestUseCase: SignupRequestUseCase,
    @inject(SignupVerifyUseCase)
    private signupVerifyUseCase: SignupVerifyUseCase
  ) {}

  async request(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { response, statusCode } =
        ErrorHandlerService.handleValidationErrors(errors.array());
      return res.status(statusCode).json(response);
    }
    try {
      const dto = new SignupRequestDto(req.body);
      const result = await this.signupRequestUseCase.execute(dto);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "signup_request"
        );
        return res.status(statusCode).json(response);
      }
      const response: ApiResponse = { success: true, message: "OTP sent." };
      res.status(200).json(response);
      Logger.info("Signup request succeeded", { email: dto.email });
    } catch (err) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        err,
        "signup_request"
      );
      res.status(statusCode).json(response);
    }
  }

  async verify(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { response, statusCode } =
        ErrorHandlerService.handleValidationErrors(errors.array());
      return res.status(statusCode).json(response);
    }
    try {
      const dto = new SignupVerifyDto(req.body);
      const result = await this.signupVerifyUseCase.execute(dto);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "signup_verify"
        );
        return res.status(statusCode).json(response);
      }
      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: "Signup complete",
        data,
      };
      res.status(201).json(response);
      Logger.info("Signup verify succeeded", { email: dto.email });
    } catch (err) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        err,
        "signup_verify"
      );
      res.status(statusCode).json(response);
    }
  }
}
