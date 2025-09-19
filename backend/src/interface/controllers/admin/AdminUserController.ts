import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { GetUsersUseCase } from "@application/use-cases/admin/GetUsersUseCase";
import { UpdateUserStatusUseCase } from "@application/use-cases/admin/UpdateUserStatusUseCase";
import { GetUsersDto } from "@application/dto/admin/GetUsersDto";
import { UpdateUserStatusDto } from "@application/dto/admin/UpdateUserStatusDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class AdminUserController {
  constructor(
    @inject(GetUsersUseCase) private getUsersUseCase: GetUsersUseCase,
    @inject(UpdateUserStatusUseCase)
    private updateUserStatusUseCase: UpdateUserStatusUseCase
  ) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GetUsersDto(req.query);
      const result = await this.getUsersUseCase.execute(dto);

      if (result.isFailure()) {
        const response: ApiResponse = {
          success: false,
          message: result.getError().message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Users fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error in getUsers controller", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new UpdateUserStatusDto({
        userId: req.params.userId,
        action: req.body.action,
        reason: req.body.reason,
      });

      const result = await this.updateUserStatusUseCase.execute(dto);

      if (result.isFailure()) {
        const response: ApiResponse = {
          success: false,
          message: result.getError().message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: `User status updated to ${dto.action}ed successfully`,
      };

      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error in updateUserStatus controller", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }
}
