import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IPaymentGatewayService } from "@application/services/IPaymentGatewayService";
import { RazorpayService } from "@infrastructure/services/RazorpayService";
import { InitiatePaymentUseCase } from "@application/use-cases/payment/InitiatePaymentUseCase";
import { VerifyPaymentUseCase } from "@application/use-cases/payment/VerifyPaymentUseCase";
import { ConfirmCashPaymentUseCase } from "@application/use-cases/payment/ConfirmCashPaymentUseCase";
import { PaymentController } from "@interface/controllers/payment/PaymentController";
import { IEarningsDistributionService } from "@application/services/IEarningsDistributionService";
import { EarningsDistributionService } from "@infrastructure/services/EarningsDistributionService";

export class PaymentFactory {
  static register(container: Container): void {
    // Services
    container
      .bind<IPaymentGatewayService>(TYPES.PaymentGatewayService)
      .to(RazorpayService)
      .inSingletonScope();

    container
      .bind<IEarningsDistributionService>(TYPES.EarningsDistributionService)
      .to(EarningsDistributionService)
      .inSingletonScope();

    // Use Cases
    container
      .bind<InitiatePaymentUseCase>(TYPES.InitiatePaymentUseCase)
      .to(InitiatePaymentUseCase);

    container
      .bind<VerifyPaymentUseCase>(TYPES.VerifyPaymentUseCase)
      .to(VerifyPaymentUseCase);

    container
      .bind<ConfirmCashPaymentUseCase>(TYPES.ConfirmCashPaymentUseCase)
      .to(ConfirmCashPaymentUseCase);

    // Controller
    container
      .bind<PaymentController>(TYPES.PaymentController)
      .to(PaymentController);
  }
}
