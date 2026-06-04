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
import { GetUserCouponsDto } from "@application/dto/user/GetUserCouponsDto";
import { GetUserCouponsResponseDto } from "@application/dto/user/GetUserCouponsResponseDto";
import { USER_MESSAGES } from "@shared/constants/UserMessages";

@injectable()
export class CouponController {
  constructor(
    @inject(TYPES.GetUserCouponsUseCase)
    private readonly getUserCouponsUseCase: IUseCase<
      GetUserCouponsDto,
      Promise<Result<GetUserCouponsResponseDto>>
    >,

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

  async getUserCoupons(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req) as string;

      Logger.info("Get user coupons request received", {
        userId,
        query: req.query,
      });

      const dto = GetUserCouponsDto.fromRequest(userId, req.query);

      const result = await this.getUserCouponsUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();

        const { response, statusCode } = ErrorHandlerService.handleError(error);

        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: USER_MESSAGES.COUPON.FETCHED,
        data,
      } as ApiResponse);
    } catch (error) {
      Logger.error("Get user coupons controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
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

      const dto = ApplyCouponDto.fromRequest(
        userId,
        { rideId: rideId as string },
        req.body,
      );

      const result = await this.applyCouponUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Apply coupon failed", {
          userId,
          rideId,
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
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

      const { response, statusCode } = ErrorHandlerService.handleError(error);
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

      const dto = RemoveCouponDto.fromRequest(userId, {
        rideId: rideId as string,
      });

      const result = await this.removeCouponUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Remove coupon failed", {
          userId,
          rideId,
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
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

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
