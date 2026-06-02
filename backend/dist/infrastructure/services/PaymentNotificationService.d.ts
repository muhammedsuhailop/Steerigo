export declare class PaymentNotificationService {
    notifyPaymentInitiated(riderId: string, payload: {
        paymentId: string;
        rideId: string;
        amount: number;
        currency: string;
        method: string;
    }): Promise<void>;
    notifyPaymentSucceeded(riderId: string, driverId: string, driverUserId: string, payload: {
        paymentId: string;
        rideId: string;
        amount: number;
        currency: string;
        paidAt: string;
    }): Promise<void>;
    notifyPaymentFailed(riderId: string, driverUserId: string, payload: {
        paymentId: string;
        rideId: string;
        reason?: string;
        failedAt: string;
    }): Promise<void>;
    notifyPaymentCashConfirmed(driverId: string, payload: {
        paymentId: string;
        rideId: string;
        riderId: string;
        amount: number;
        currency: string;
        paidAt: string;
    }): Promise<void>;
}
//# sourceMappingURL=PaymentNotificationService.d.ts.map