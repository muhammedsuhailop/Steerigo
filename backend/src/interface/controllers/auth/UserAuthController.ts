import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { GetCurrentUserUseCase } from "@application/use-cases/auth/GetCurrentUserUseCase";
import { GetCurrentUserDto, LoginRequestDto } from "@application/dto/auth";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class UserAuthController {
  constructor(
    @inject(TYPES.LoginUseCase) private loginUseCase: LoginUseCase,
    @inject(TYPES.GetCurrentUserUseCase)
    private getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const dto = new LoginRequestDto(req.body);
      const result = await this.loginUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "login"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: "Login successful",
        data,
      };

      res.status(200).json(response);
      Logger.info("Login completed successfully", {
        email: dto.getEmailValue(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "login"
      );
      res.status(statusCode).json(response);
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const getCurrentUserDto = new GetCurrentUserDto({ userId });
      const result =
        await this.getCurrentUserUseCase.execute(getCurrentUserDto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_current_user"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: "User retrieved successfully",
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_current_user"
      );
      res.status(statusCode).json(response);
    }
  }
}
