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
}
