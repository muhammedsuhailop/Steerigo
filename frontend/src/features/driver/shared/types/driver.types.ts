export interface Driver {
  id: string;
  driverId: string;
  userId: string; 
  name: string;
  email: string;
  mobile: string;
  profileImage?: string;
  currentStatus: "Available" | "Busy" | "Offline";
  rating: number;
  totalRides: number;
  completedRides: number;
  scheduledRides: number;
  totalEarnings: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;

  // Add driver license info
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  kycStatus: string;
  status: string;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];

  vehicleInfo?: VehicleInfo;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  type: "sedan" | "suv" | "hatchback" | "luxury";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
}

export interface RideRequest {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  passengerRating: number;
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  estimatedFare: number;
  distance: number;
  estimatedDuration: number;
  rideType: "oneway" | "roundtrip";
  requestTime: string;
  scheduledTime?: string;
  specialRequests?: string;
  paymentMethod: "cash" | "card" | "wallet";
}

export interface CurrentRide {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  fare: number;
  distance: number;
  duration: number;
  status:
    | "accepted"
    | "pickup"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "rejected";
  startTime: string;
  estimatedArrival?: string;
  actualPickupTime?: string;
  actualDropoffTime?: string;
  paymentMethod: "cash" | "card" | "wallet";
  paymentStatus: "pending" | "completed" | "failed";
}

// Extended DriverStats with all fields
export interface DriverStats {
  // Basic stats
  totalRides: number;
  completedRides: number;
  ridesCancelled: number;
  scheduledRides: number;

  // Earnings
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  currency: string;

  // Performance metrics
  rating: number;
  acceptanceRate: number;
  cancellationRate: number;
  completionRate: number;
}

export interface Availability {
  id: string;
  status: string;
  availableFrom: string;
  availableTill: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  updatedAt: string;
}

export interface DashboardMeta {
  lastUpdated: string;
  serverTime: string;
}

export interface DashboardApiResponse {
  data: {
    driver: {
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
    };
    availability: Availability | null;
    currentRide: CurrentRide | null;
    pendingRequests: RideRequest[];
    statistics: {
      ridesCompleted: number;
      ridesCancelled: number;
      scheduledRides: number;
      totalEarnings: number;
      currency: string;
    };
    performance: {
      acceptanceRate: number;
      cancellationRate: number;
      averageRating: number;
    };
    meta: DashboardMeta;
  };
  success: boolean;
  message: string;
}

export interface FullDashboardResponse {
  driver: Driver;
  stats: DriverStats;
  availability: Availability | null;
  currentRide: CurrentRide | null;
  pendingRequests: RideRequest[];
  meta: DashboardMeta;
}

export interface DriverState {
  driver: Driver | null;
  stats: DriverStats | null;
  pendingRequests: RideRequest[];
  currentRide: CurrentRide | null;
  availability: Availability | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  driverId: string | null;
}
