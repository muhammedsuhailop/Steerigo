// Location type
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Ride Request
export interface RideRequest {
  requestId: string;
  pickup: Location;
  drop: Location;
  pickupTime: string; // ISO date string
  rideType: string; // "One Way" | "Round Trip"
  fare: number;
  userName: string;
  status: string; // "Pending" | "Accepted" | "Rejected" | "Expired"
  pickupETA: string;
}

// Current Ride type
export interface CurrentRide {
  rideId: string;
  riderId: string;
  userName: string;
  userPhone: string;
  pickup: Location;
  drop: Location;
  status: string;
  fare: number;
  startTime?: string;
  estimatedDuration?: number;
}

// Driver Availability
export interface DriverAvailability {
  id: string;
  status: string; // "Available" | "Unavailable" | "Busy"
  availableFrom: string;
  availableTill: string;
  currentLocation: Location;
  updatedAt: string;
}

// Driver Statistics
export interface DriverStats {
  ridesCompleted: number;
  ridesCancelled: number;
  scheduledRides: number;
  totalEarnings: number;
  currency: string;
}

// Driver Performance
export interface DriverPerformance {
  acceptanceRate: number;
  cancellationRate: number;
  averageRating: number;
}

// Driver profile
export interface Driver {
  driverId: string;
  userId: string;
  name: string;
  email: {
    value: string;
  };
  mobile: string;
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  kycStatus: string;
  status: string;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  currentStatus?: string; // "Available" | "Busy" | "Offline"
}

// Dashboard Response
export interface DashboardData {
  driver: Driver;
  availability: DriverAvailability | null;
  currentRide: CurrentRide | null;
  pendingRequests: RideRequest[];
  statistics: DriverStats;
  performance: DriverPerformance;
  meta: {
    lastUpdated: string;
    serverTime: string;
  };
}
