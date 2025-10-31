import { Email } from "@domain/value-objects/Email";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";

export interface DriverInfo {
  driverId: string;
  userId: string;
  name: string;
  email: Email;
  mobile: string | undefined;
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: Date;
  licenseExpiryDate: Date;
  kycStatus: string;
  status: string;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
}

export interface AvailabilityInfo {
  id: string;
  status: string;
  availableFrom: Date;
  availableTill: Date;
  currentLocation:Location
  updatedAt: Date;
}

export interface CurrentRideInfo {
  rideId: string;
  status: string;
  pickup: Location;
  drop: Location;
  rider: {
    id: string;
    name: string;
    mobile: string | undefined;
  };
  rideType: RideType;
  fare: number;
  currency: string;
  startedAt: Date;
  timer: string;
}

export interface PendingRequest {
  requestId: string;
  pickup: Location;
  drop: Location;
  pickupTime: Date;
  rideType: string;
  fare: number;
  userName: string;
  status: string;
  pickupETA: string;
}

export interface Statistics {
  ridesCompleted: number;
  ridesCancelled: number;
  scheduledRides: number;
  totalEarnings: number;
  currency: string;
}

export interface Performance {
  acceptanceRate: number;
  cancellationRate: number;
  averageRating: number;
}

export interface DashboardMeta {
  lastUpdated: Date;
  serverTime: Date;
}

export class DriverDashboardResponseDto {
  success: boolean = true;
  message: string = "Driver dashboard fetched successfully";

  constructor(
    public data: {
      driver: DriverInfo;
      availability: AvailabilityInfo | null;
      currentRide: CurrentRideInfo | null;
      pendingRequests: PendingRequest[];
      statistics: Statistics;
      performance: Performance;
      meta: DashboardMeta;
    }
  ) {}
}
