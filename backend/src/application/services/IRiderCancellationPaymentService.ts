import { Money } from "@domain/value-objects/Money";

export interface RiderCancellationPaymentResult {
  success: boolean;
  charged: boolean;
  addedToArrears: boolean;
  failureReason?: string;
}

export interface IRiderCancellationPaymentService {
  handleRiderCancellationPayment(params: {
    riderId: string;
    rideId: string;
    fee: Money;
  }): Promise<RiderCancellationPaymentResult>;
}
