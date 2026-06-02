import { IEventHandler } from "@application/events/IEventHandler";
import { PaymentSucceededEvent } from "@application/events/PaymentEvents";
import { ICouponUsageService } from "@application/services/ICouponUsageService";
import { IEventBus } from "@application/services/IEventBus";
export declare class RecordCouponUsageOnPaymentSucceededHandler implements IEventHandler<PaymentSucceededEvent> {
    private readonly eventBus;
    private readonly couponUsageService;
    constructor(eventBus: IEventBus, couponUsageService: ICouponUsageService);
    handle(event: PaymentSucceededEvent): Promise<void>;
}
//# sourceMappingURL=RecordCouponUsageOnPaymentSucceededHandler.d.ts.map