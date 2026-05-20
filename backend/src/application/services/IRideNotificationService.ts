import {
  FutureRideLastRequestRejectedEvent,
  FutureRideRequestSentToDriverEvent,
} from "@application/events/FutureRideEvents";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
import { DriverCancellationReason } from "@domain/value-objects/DriverRideCancellationReason";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
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
  fareBreakdown: FareBreakdown;
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

export interface RideSearchProgressPayload {
  requestGroupId: string;
  currentIndex: number;
  totalCandidates: number;
  message: string;
  status: "SEARCHING" | "COMPLETED" | "EXPIRED";
}

export interface FutureRideAcceptedPayload {
  futureRequestId: string;
  requestGroupId: string;

  rideId: string;
  driverId: string;

  status: FutureRideRequestStatus;

  pickup: {
    readonly latitude: number;
    readonly longitude: number;
    readonly address?: string;
  };

  drop: {
    readonly latitude: number;
    readonly longitude: number;
    readonly address?: string;
  };

  pickupTime: string;

  rideType: string;

  fare: {
    readonly amount: number;
    readonly currency: string;
  };
}

export interface FutureRideAllDriversRejectedPayload {
  readonly requestGroupId: string;
  readonly pickupTime: string;
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

  notifyRiderSearchProgress(
    riderId: string,
    payload: RideSearchProgressPayload,
  ): Promise<void>;

  notifyDriverNewFutureRequest(
    driverId: string,
    payload: Omit<
      FutureRideRequestSentToDriverEvent["payload"],
      "driverId" | "driverUserId"
    >,
  ): Promise<void>;

  notifyFutureRideAccepted(
    riderId: string,
    payload: FutureRideAcceptedPayload,
  ): Promise<void>;

  notifyFutureRideExpired(
    riderId: string,
    payload: {
      requestGroupId: string;
    },
  ): Promise<void>;

  notifyDriverFutureRideExpired(
    driverUserId: string,
    payload: {
      futureRequestId: string;
      requestGroupId: string;
      driverId: string;
      riderId: string;
      pickupTime: string;
    },
  ): Promise<void>;

  notifyDriverFutureRideRequestCancelled(
    driverUserId: string,
    payload: {
      futureRequestId: string;
      requestGroupId: string;
      driverId: string;
      acceptedByDriverId: string;
    },
  ): Promise<void>;

  notifyDriverRideRequestExpired(
    driverId: string,
    payload: {
      requestId: string;
      requestGroupId: string;
      riderId: string;
      expiredAt: string;
    },
  ): Promise<void>;

  notifyRiderFutureRideAllDriversRejected(
    riderId: string,
    payload: FutureRideAllDriversRejectedPayload,
  ): Promise<void>;
}
