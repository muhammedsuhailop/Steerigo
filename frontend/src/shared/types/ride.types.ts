export enum RideStatus {
  REQUESTED = "Requested",
  ACCEPTED = "Accepted",
  STARTED = "Started",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  REJECTED = "Rejected",
  ARRIVED = "Arrived",
}

export enum FutureRideRequestStatus {
  PENDING = "Pending",
  MATCHED = "Matched",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  EXPIRED = "Expired",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
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

export enum RideCancellationReason {
  RIDER_CHANGED_MIND = "Rider changed mind",
  DRIVER_DELAYED = "Driver delayed",
  DRIVER_NOT_MOVING = "Driver not moving",
  WRONG_PICKUP_LOCATION = "Wrong pickup location",
  FOUND_ALTERNATIVE = "Found alternative",
  EMERGENCY = "Emergency",
  OTHER = "Other",
}

export enum DriverCancellationReason {
  VEHICLE_BREAKDOWN = "Vehicle breakdown",
  EMERGENCY = "Emergency",
  RIDER_UNRESPONSIVE = "Rider unresponsive",
  WRONG_PICKUP_LOCATION = "Wrong pickup location",
  SAFETY_CONCERN = "Safety concern",
  OTHER = "Other",
}

export interface Money {
  amount: number;
  currency: string;
}
export interface RideTaxComponent {
  name: string;
  amount: Money;
}

export interface TaxDetail {
  name: string;
  rate: number;
  amount: Money;
}

export interface RideTaxes {
  fare: RideTaxComponent;
  platformFee: RideTaxComponent;
}

export interface RideFareBreakdown {
  baseFare: Money;
  platformFee: Money;
  taxes: {
    fare: TaxDetail;
    platformFee: TaxDetail;
  };
  totalFare: Money;
  durationHours: number;
  calculatedAt: string;
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

export interface PaymentSucceededPayload {
  paymentId: string;
  rideId: string;
  riderId: string;
  amount: number;
  currency: string;
  paidAt: string;
}

export interface PaymentFailedPayload {
  paymentId: string;
  rideId: string;
  riderId: string;
  reason?: string;
  failedAt: string;
}

export interface PaymentCashConfirmedPayload {
  paymentId: string;
  rideId: string;
  driverId: string;
  riderId: string;
  amount: number;
  currency: string;
  paidAt: string;
}

export interface RideCancelledEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  driverUserId: string;
  status: string;
  reason: RideCancellationReason;
  cancellationFeeAmount: number;
  cancellationFeeCurrency: string;
  cancelledAt: string;
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

export interface RideCancelledByDriverEventPayload {
  rideId: string;
  riderId: string;
  driverId: string;
  driverUserId: string;
  status: string;
  reason: DriverCancellationReason;
  riderChargeAmount: number;
  riderChargeCurrency: string;
  driverPenaltyAmount: number;
  driverPenaltyCurrency: string;
  penaltyDeducted: boolean;
  cancelledAt: string;
  pickup: { latitude: number; longitude: number; address?: string };
  drop: { latitude: number; longitude: number; address?: string };
}
