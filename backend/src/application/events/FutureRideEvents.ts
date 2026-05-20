import { DomainEvent } from "./DomainEvent";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";

export interface FutureRideAcceptedEvent extends DomainEvent {
  readonly type: "FutureRideAccepted";
  readonly payload: {
    readonly futureRequestId: string;
    readonly requestGroupId: string;
    readonly rideId: string;
    readonly driverId: string;
    readonly riderId: string;

    readonly status: FutureRideRequestStatus;

    readonly pickup: {
      readonly latitude: number;
      readonly longitude: number;
      readonly address?: string;
    };

    readonly drop: {
      readonly latitude: number;
      readonly longitude: number;
      readonly address?: string;
    };

    readonly pickupTime: string;

    readonly rideType: string;

    readonly fare: {
      readonly amount: number;
      readonly currency: string;
    };
  };
}

export interface FutureRideExpiredEvent extends DomainEvent {
  readonly type: "FutureRideExpired";
  readonly payload: {
    readonly requestGroupId: string;
    readonly riderId: string;
    readonly cancelledCount: number;
  };
}

export interface FutureRideCancelledByRiderEvent extends DomainEvent {
  readonly type: "FutureRideCancelledByRider";
  readonly payload: {
    readonly requestGroupId: string;
    readonly riderId: string;
    readonly cancelledCount: number;
  };
}

export interface FutureRideRequestSentToDriverEvent extends DomainEvent {
  readonly type: "FutureRideRequestSentToDriver";
  readonly payload: {
    readonly requestId: string;
    readonly requestGroupId: string;
    readonly driverId: string;
    readonly driverUserId: string;
    readonly riderId: string;
    readonly pickup: {
      readonly latitude: number;
      readonly longitude: number;
      readonly address: string | undefined;
    };
    readonly drop: {
      readonly latitude: number;
      readonly longitude: number;
      readonly address: string | undefined;
    };
    readonly pickupTime: string;
    readonly pickupETA: string;
    readonly rideType: string;
    readonly fare: number;
    readonly currency: string;
    readonly status: FutureRideRequestStatus;
    readonly requiredDuration: number;
    readonly createdAt: string;
    readonly expiresAt: string;
  };
}

export interface FutureRideRequestExpiredForDriverEvent extends DomainEvent {
  readonly type: "FutureRideRequestExpiredForDriver";
  readonly payload: {
    readonly futureRequestId: string;
    readonly requestGroupId: string;
    readonly driverId: string;
    readonly driverUserId: string;
    readonly riderId: string;
    readonly pickupTime: string;
  };
}

export interface FutureRideRequestCancelledForDriverEvent extends DomainEvent {
  readonly type: "FutureRideRequestCancelledForDriver";
  readonly payload: {
    readonly futureRequestId: string;
    readonly requestGroupId: string;
    readonly driverId: string;
    readonly driverUserId: string;
    readonly acceptedByDriverId: string | null;
    readonly cancelledByRider: boolean;
  };
}

export interface FutureRideLastRequestRejectedEvent extends DomainEvent {
  readonly type: "FutureRideLastRequestRejected";
  readonly payload: {
    readonly requestGroupId: string;
    readonly riderId: string;
    readonly pickupTime: string;
  };
}

export type FutureRideDomainEvent =
  | FutureRideAcceptedEvent
  | FutureRideExpiredEvent
  | FutureRideCancelledByRiderEvent
  | FutureRideRequestSentToDriverEvent
  | FutureRideRequestExpiredForDriverEvent
  | FutureRideRequestCancelledForDriverEvent
  | FutureRideLastRequestRejectedEvent;
