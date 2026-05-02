import { injectable, inject } from "inversify";
import { IEventHandler } from "@application/events/IEventHandler";
import { PaymentCashConfirmedEvent } from "@application/events/PaymentEvents";
import { ICouponUsageService } from "@application/services/ICouponUsageService";
import { IEventBus } from "@application/services/IEventBus";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class RecordCouponUsageOnPaymentCashConfirmedHandler
  implements IEventHandler<PaymentCashConfirmedEvent>
{
  constructor(
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,

    @inject(TYPES.CouponUsageService)
    private readonly couponUsageService: ICouponUsageService,
  ) {
    this.eventBus.subscribe("PaymentCashConfirmed", this);
  }

  async handle(event: PaymentCashConfirmedEvent): Promise<void> {
    try {
      Logger.info("Coupon usage handler triggered", {
        rideId: event.payload.rideId,
      });

      await this.couponUsageService.recordUsage(event.payload.rideId);
    } catch (error) {
      Logger.error("Failed to record coupon usage for PaymentCashConfirmed", {
        rideId: event.payload.rideId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
