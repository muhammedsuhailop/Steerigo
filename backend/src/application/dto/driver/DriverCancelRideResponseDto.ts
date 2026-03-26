import { DriverCancellationReason } from "@domain/value-objects/DriverRideCancellationReason";
import { RideStatus } from "@domain/value-objects/RideStatus";

export interface DriverCancelRideResponseDto {
  rideId: string;
  status: RideStatus;
  reason: DriverCancellationReason;
  riderCharge: {
    amount: number;
    currency: string;
  };
  driverPenalty: {
    amount: number;
    currency: string;
  };
  penaltyDeducted: boolean;
  penaltyAddedToArrears: boolean;
  message: string;
}
