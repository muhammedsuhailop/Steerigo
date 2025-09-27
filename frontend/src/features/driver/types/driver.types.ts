export interface Driver {
  id: string;
  driverId: string;
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
  vehicleInfo: VehicleInfo;
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

export interface DriverStats {
  totalRides: number;
  completedRides: number;
  scheduledRides: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  rating: number;
  acceptanceRate: number;
  completionRate: number;
}

export interface DriverState {
  driver: Driver | null;
  stats: DriverStats | null;
  pendingRequests: RideRequest[];
  currentRide: CurrentRide | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
}
