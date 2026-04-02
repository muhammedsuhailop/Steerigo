import { ApplyCouponDto } from "@application/dto/user/ApplyCouponDto";
import { ApplyCouponResponseDto } from "@application/dto/user/ApplyCouponResponseDto";
import { RemoveCouponDto } from "@application/dto/user/RemoveCouponDto";
import { RemoveCouponResponseDto } from "@application/dto/user/RemoveCouponResponseDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { TYPES } from "@shared/constants/DITypes";
import { Result } from "@shared/utils/Result";
import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { ApiResponse } from "@shared/types/Common";

@injectable()
export class CouponController {
  constructor(
    @inject(TYPES.ApplyCouponUseCase)
    private readonly applyCouponUseCase: IUseCase<
      ApplyCouponDto,
      Promise<Result<ApplyCouponResponseDto>>
    >,

    @inject(TYPES.RemoveCouponUseCase)
    private readonly removeCouponUseCase: IUseCase<
      RemoveCouponDto,
      Promise<Result<RemoveCouponResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async applyCoupon(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req) as string;
      const rideId = req.params.rideId;

      Logger.info("Apply coupon request received from rider", {
        userId,
        rideId,
        body: req.body,
      });

      const dto = ApplyCouponDto.fromRequest(userId, { rideId }, req.body);

      const result = await this.applyCouponUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Apply coupon failed", {
          userId,
          rideId,
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "apply_coupon",
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      Logger.info("Coupon applied successfully", {
        userId,
        rideId: data.rideId,
        couponCode: data.couponCode,
        discountAmount: data.discountAmount,
        payableAmount: data.payableAmount,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: data.message,
        data,
      } as ApiResponse);
    } catch (error) {
      Logger.error("Apply coupon controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "apply_coupon",
      );
      res.status(statusCode).json(response);
    }
  }

  async removeCoupon(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req) as string;
      const rideId = req.params.rideId;

      Logger.info("Remove coupon request received from rider", {
        userId,
        rideId,
      });

      const dto = RemoveCouponDto.fromRequest(userId, { rideId });

      const result = await this.removeCouponUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Remove coupon failed", {
          userId,
          rideId,
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "remove_coupon",
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      Logger.info("Coupon removed successfully", {
        userId,
        rideId: data.rideId,
        payableAmount: data.payableAmount,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: data.message,
        data,
      } as ApiResponse);
    } catch (error) {
      Logger.error("Remove coupon controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "remove_coupon",
      );
      res.status(statusCode).json(response);
    }
  }
}
