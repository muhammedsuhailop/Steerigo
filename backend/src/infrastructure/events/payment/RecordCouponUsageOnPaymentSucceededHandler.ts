import { injectable, inject } from "inversify";
import { IEventHandler } from "@application/events/IEventHandler";
import { PaymentSucceededEvent } from "@application/events/PaymentEvents";
import { ICouponUsageService } from "@application/services/ICouponUsageService";
import { IEventBus } from "@application/services/IEventBus";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class RecordCouponUsageOnPaymentSucceededHandler
  implements IEventHandler<PaymentSucceededEvent>
{
  constructor(
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,

    @inject(TYPES.CouponUsageService)
    private readonly couponUsageService: ICouponUsageService,
  ) {
    this.eventBus.subscribe("PaymentSucceeded", this);
  }

  async handle(event: PaymentSucceededEvent): Promise<void> {
    try {
      await this.couponUsageService.recordUsage(event.payload.rideId);
    } catch (error) {
      Logger.error("Failed to record coupon usage for PaymentSucceeded", {
        rideId: event.payload.rideId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
