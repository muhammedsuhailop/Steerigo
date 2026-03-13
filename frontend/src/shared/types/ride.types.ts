export enum RideStatus {
  REQUESTED = "Requested",
  ACCEPTED = "Accepted",
  STARTED = "Started",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  REJECTED = "Rejected",
  ARRIVED = "Arrived",
}

export interface RideTimeline {
  requestedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  rejectedAt?: string;

  paymentInitiatedAt?: string;
  paymentCompletedAt?: string;
  paymentFailedAt?: string;
  paymentRefundedAt?: string;
}

export interface Money {
  amount: number;
  currency: string;
}
export interface RideTaxComponent {
  name: string;
  amount: Money;
}

export interface RideTaxes {
  fare: RideTaxComponent;
  platformFee: RideTaxComponent;
}

export interface RideFareBreakdown {
  baseFare: Money;
  platformFee: Money;
  taxes: RideTaxes;
  totalFare: Money;
  durationHours: number;
  actualDurationMinutes: number;
}

export interface RideArrivedPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  status: RideStatus;
  arrivedAt: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface RideStartedPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  status: RideStatus;
  arrivedAt: string;
  startedAt: string;
  wasArrivedAutoSet: boolean;
  pickup: Location;
  drop: Location;
}

export interface RideCompletedPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  status: RideStatus;
  arrivedAt?: string;
  startedAt: string;
  completedAt: string;
  fareBreakdown: RideFareBreakdown;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Distance {
  value: number;
  unit: string;
}

export interface ETA {
  value: number;
  unit: string;
}
