import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UpdatePasswordUseCase } from "@application/use-cases/auth/UpdatePasswordUseCase";
import { UpdatePasswordDto } from "@application/dto/auth";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class PasswordController {
  constructor(
    @inject(UpdatePasswordUseCase)
    private updatePasswordUseCase: UpdatePasswordUseCase
  ) {}

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const userId = req.user!.userId;
      const dto = new UpdatePasswordDto(req.body);
      const result = await this.updatePasswordUseCase.execute(userId, dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "update_password"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Password updated successfully",
      };

      res.status(200).json(response);
      Logger.info("Password updated successfully", { userId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_password"
      );
      res.status(statusCode).json(response);
    }
  }
}
