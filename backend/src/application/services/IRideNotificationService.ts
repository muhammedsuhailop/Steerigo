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
}
