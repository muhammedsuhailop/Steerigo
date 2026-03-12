import {
  DriverRequestNotificationPayload,
  RideFareBreakdownJson,
} from "@application/services/IRideNotificationService";

export interface BaseRideEvent<TType extends string, TPayload> {
  type: TType;
  occurredAt: Date;
  payload: TPayload;
}

export interface RideMatchedEventPayload {
  riderId: string;
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

export interface RideRequestCreatedPayload
  extends DriverRequestNotificationPayload {
  driverId: string;
}

export type RideRequestCreatedEvent = BaseRideEvent<
  "RideRequestCreated",
  RideRequestCreatedPayload
>;

export interface RideMatchedEvent
  extends BaseRideEvent<"RideMatched", RideMatchedEventPayload> {}

export interface RideRequestGroupExhaustedPayload {
  requestGroupId: string;
  riderId: string;
  reason: string;
}

export type RideRequestGroupExhaustedEvent = BaseRideEvent<
  "RideRequestGroupExhausted",
  RideRequestGroupExhaustedPayload
>;

export interface RideArrivedEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  status: string;
  arrivedAt: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface RideStartedEventPayload {
  rideId: string;
  riderId: string;
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

export interface RideCompletedEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  status: string;
  arrivedAt?: string;
  startedAt: string;
  completedAt: string;
  fareBreakdown: RideFareBreakdownJson;
}

export type RideArrivedEvent = BaseRideEvent<
  "RideArrived",
  RideArrivedEventPayload
>;
export type RideStartedEvent = BaseRideEvent<
  "RideStarted",
  RideStartedEventPayload
>;
export type RideCompletedEvent = BaseRideEvent<
  "RideCompleted",
  RideCompletedEventPayload
>;

export type RideDomainEvent =
  | RideRequestCreatedEvent
  | RideMatchedEvent
  | RideRequestGroupExhaustedEvent
  | RideArrivedEvent
  | RideStartedEvent
  | RideCompletedEvent;
