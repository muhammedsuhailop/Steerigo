import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { RecordCouponUsageOnPaymentSucceededHandler } from "@infrastructure/events/payment/RecordCouponUsageOnPaymentSucceededHandler";
import { RecordCouponUsageOnPaymentCashConfirmedHandler } from "@infrastructure/events/payment/RecordCouponUsageOnPaymentCashConfirmedHandler";

export class EventHandlersFactory {
  static register(container: Container): void {
    container
      .bind<RecordCouponUsageOnPaymentSucceededHandler>(
        TYPES.CouponUsageOnPaymentSucceededHandler,
      )
      .to(RecordCouponUsageOnPaymentSucceededHandler)
      .inSingletonScope();

    container
      .bind<RecordCouponUsageOnPaymentCashConfirmedHandler>(
        TYPES.CouponUsageOnPaymentCashConfirmedHandler,
      )
      .to(RecordCouponUsageOnPaymentCashConfirmedHandler)
      .inSingletonScope();
  }

  static init(container: Container): void {
    container.get(TYPES.CouponUsageOnPaymentSucceededHandler);
    container.get(TYPES.CouponUsageOnPaymentCashConfirmedHandler);
  }
}
