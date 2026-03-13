import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { InitiatePaymentDto } from "@application/dto/payment/InitiatePaymentDto";
import { InitiatePaymentResponseDto } from "@application/dto/payment/InitiatePaymentResponseDto";
import { VerifyPaymentDto } from "@application/dto/payment/VerifyPaymentDto";
import { VerifyPaymentResponseDto } from "@application/dto/payment/VerifyPaymentResponseDto";
import { ConfirmCashPaymentDto } from "@application/dto/payment/ConfirmCashPaymentDto";
import { ConfirmCashPaymentResponseDto } from "@application/dto/payment/ConfirmCashPaymentResponseDto";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { ApiResponse } from "@shared/types/Common";

@injectable()
export class PaymentController {
  constructor(
    @inject(TYPES.InitiatePaymentUseCase)
    private readonly initiatePaymentUseCase: IUseCase<
      InitiatePaymentDto,
      Promise<Result<InitiatePaymentResponseDto>>
    >,

    @inject(TYPES.VerifyPaymentUseCase)
    private readonly verifyPaymentUseCase: IUseCase<
      VerifyPaymentDto,
      Promise<Result<VerifyPaymentResponseDto>>
    >,

    @inject(TYPES.ConfirmCashPaymentUseCase)
    private readonly confirmCashPaymentUseCase: IUseCase<
      ConfirmCashPaymentDto,
      Promise<Result<ConfirmCashPaymentResponseDto>>
    >,
  ) {}

  async initiatePayment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { rideId, method } = req.body;

      const dto = InitiatePaymentDto.create({ userId, rideId, method });

      const result = await this.initiatePaymentUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "initiate_payment",
        );

        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue());
    } catch (error) {
      Logger.error("PaymentController.initiatePayment error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "initiate_payment",
      );

      res.status(statusCode).json(response);
    }
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const { paymentId, gatewayOrderId, gatewayPaymentId, gatewaySignature } =
        req.body;

      const dto = VerifyPaymentDto.create({
        userId,
        paymentId,
        gatewayOrderId,
        gatewayPaymentId,
        gatewaySignature,
      });

      const result = await this.verifyPaymentUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "verify_payment",
        );

        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue());
    } catch (error) {
      Logger.error("PaymentController.verifyPayment error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "verify_payment",
      );

      res.status(statusCode).json(response);
    }
  }

  async confirmCashPayment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { rideId, method, amount } = req.body;

      const dto = ConfirmCashPaymentDto.create({
        userId,
        rideId,
        method,
        amount,
      });

      const result = await this.confirmCashPaymentUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "confirm_cash_payment",
        );

        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue());
    } catch (error) {
      Logger.error("PaymentController.confirmCashPayment error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "confirm_cash_payment",
      );

      res.status(statusCode).json(response);
    }
  }
}
