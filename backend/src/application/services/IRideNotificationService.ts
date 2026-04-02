import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
import { DriverCancellationReason } from "@domain/value-objects/DriverRideCancellationReason";
import { RideCancellationReason } from "@domain/value-objects/RideCancellationReason";

export interface DriverRequestNotificationPayload {
  requestId: string;
  requestGroupId: string;
  riderId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  pickupTime: string;
  rideType: string;
  pickupETA: string;
  fare: {
    amount: number;
    currency: string;
  };
  searchedAt: string;
  expiresAt: string;
}

export interface RiderRideMatchedPayload {
  rideId: string;
  driverId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  pickupTime: string;
  rideType: string;
  status: string;
  currency: string;
  fare: {
    amount: number;
    currency: string;
  };
}

export interface RiderNoDriverFoundPayload {
  requestGroupId: string;
  reason: string;
}

export interface DriverRequestCancelledPayload {
  requestId: string;
  requestGroupId: string;
}

export interface RideFareMoneyJson {
  amount: number;
  currency: string;
}

export interface RideFareTaxJson {
  name: string;
  amount: RideFareMoneyJson;
}

export interface RideFareBreakdownJson {
  baseFare: RideFareMoneyJson;
  platformFee: RideFareMoneyJson;
  taxes: {
    fare: RideFareTaxJson;
    platformFee: RideFareTaxJson;
  };
  totalFare: RideFareMoneyJson;
  durationHours: number;
  actualDurationMinutes: number;
}

export interface RideArrivedPayload {
  rideId: string;
  driverId: string;
  status: string;
  arrivedAt: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface RideStartedPayload {
  rideId: string;
  driverId: string;
  status: string;
  arrivedAt: string;
  startedAt: string;
  wasArrivedAutoSet: boolean;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface RideCompletedPayload {
  rideId: string;
  driverId: string;
  status: string;
  arrivedAt?: string;
  startedAt: string;
  completedAt: string;
  fareBreakdown: RideFareBreakdownJson;
  payableAmount: number;
}

export interface RideCancelledRiderPayload {
  rideId: string;
  driverId: string;
  reason: RideCancellationReason;
  cancellationFeeAmount: number;
  cancellationFeeCurrency: string;
  cancelledAt: string;
  pickup: { latitude: number; longitude: number; address?: string };
  drop: { latitude: number; longitude: number; address?: string };
}

export interface RideCancelledDriverPayload {
  rideId: string;
  riderId: string;
  reason: RideCancellationReason;
  cancelledAt: string;
  pickup: { latitude: number; longitude: number; address?: string };
  drop: { latitude: number; longitude: number; address?: string };
}

export interface RideCancelledByDriverRiderPayload {
  rideId: string;
  driverId: string;
  reason: DriverCancellationReason;
  riderChargeAmount: number;
  riderChargeCurrency: string;
  cancelledAt: string;
  pickup: { latitude: number; longitude: number; address?: string };
  drop: { latitude: number; longitude: number; address?: string };
}

export interface RideCancelledByDriverDriverPayload {
  rideId: string;
  riderId: string;
  reason: DriverCancellationReason;
  driverPenaltyAmount: number;
  driverPenaltyCurrency: string;
  penaltyDeducted: boolean;
  cancelledAt: string;
  pickup: { latitude: number; longitude: number; address?: string };
  drop: { latitude: number; longitude: number; address?: string };
}

export interface DriverFareUpdatedPayload {
  rideId: string;
  payableAmount: number;
  discountAmount: number;
  couponCode?: string;
  couponType?: CouponDiscountType;
}

export interface IRideNotificationService {
  notifyDriverNewRequest(
    driverId: string,
    payload: DriverRequestNotificationPayload,
  ): Promise<void>;

  notifyDriverRequestCancelled(
    driverId: string,
    payload: DriverRequestCancelledPayload,
  ): Promise<void>;

  notifyRiderRideMatched(
    riderId: string,
    payload: RiderRideMatchedPayload,
  ): Promise<void>;

  notifyRiderNoDriverFound(
    riderId: string,
    payload: RiderNoDriverFoundPayload,
  ): Promise<void>;

  notifyRiderRideArrived(
    riderId: string,
    payload: RideArrivedPayload,
  ): Promise<void>;

  notifyRiderRideStarted(
    riderId: string,
    payload: RideStartedPayload,
  ): Promise<void>;

  notifyRideCompleted(
    riderId: string,
    payload: RideCompletedPayload,
  ): Promise<void>;

  notifyRiderRideCancelled(
    riderId: string,
    payload: RideCancelledRiderPayload,
  ): Promise<void>;

  notifyDriverRideCancelled(
    driverId: string,
    payload: RideCancelledDriverPayload,
  ): Promise<void>;

  notifyRiderRideCancelledByDriver(
    riderId: string,
    payload: RideCancelledByDriverRiderPayload,
  ): Promise<void>;

  notifyDriverRideCancelledConfirmation(
    driverUserId: string,
    payload: RideCancelledByDriverDriverPayload,
  ): Promise<void>;

  notifyDriverFareUpdated(
    driverUserId: string,
    payload: DriverFareUpdatedPayload,
  ): Promise<void>;
}
