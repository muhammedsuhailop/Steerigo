import { Distance, ETA, Location } from "@/shared/types/ride.types";

export type SessionStatus =
  | "IDLE"
  | "SEARCHING"
  | "REQUESTED"
  | "MATCHED"
  | "EXPIRED"
  | "CANCELLED";
export interface SearchProgress {
  currentIndex: number;
  totalCandidates: number;
  message: string;
  status: "SEARCHING" | "COMPLETED" | "EXPIRED";
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  profilePicture?: string;
  rating: number;
  totalRides: number;
  status: string;
  gearType: string;
  bodyType: string;
  distance: Distance;
  eta: ETA;
  currentLocation: Location;
  availabilityStatus: string;
}

export interface SearchFormFilters {
  radiusKm: number;
  gearType: string;
  bodyType: string;
  timeRequired: number;
}

export interface SearchCriteria {
  tripType: "oneway" | "roundtrip";
  pickupLocation: Location;
  dropLocation?: Location;
  rideStartDateTime: string;
  searchRadiusKm: number;
  gearType: string;
  bodyType: string;
}

export interface MoneyAmount {
  amount: number;
  currency: string;
}

export interface TaxInfo {
  name: string;
  rate: number;
  amount: MoneyAmount;
}

export interface EstimatedFare {
  baseFare: MoneyAmount;
  platformFee: MoneyAmount;
  taxes: {
    fare: TaxInfo;
    platformFee: TaxInfo;
  };
  totalFare: MoneyAmount;
  durationHours: number;
  calculatedAt: string;
}

export interface DriverSearchSummary {
  totalFound: number;
  searchedAt: string;
  searchCriteria: SearchCriteria;
}

export interface DriverSearchResponse {
  success: boolean;
  message: string;
  data: {
    drivers: Driver[];
    estimatedFare: EstimatedFare;
    summary: DriverSearchSummary;
  };
}

export interface SearchNearbyDriversPayload {
  latitude: number;
  longitude: number;
  searchDate: string;
  timeRequired: number;
  radiusKm: number;
  gearType?: string;
  bodyType?: string;
  limit: number;
}

export interface DriverSearchState {
  drivers: Driver[];
  estimatedFare: EstimatedFare | null;
  searchCriteria: SearchCriteria | null;
  isLoading: boolean;
  error: string | null;
  totalFound: number;
  requestGroupId: string | null;
  searchedAt: string | null;
  sessionStatus: SessionStatus;
  progress: SearchProgress | null;
}

export interface TripFormData {
  tripType: "oneway" | "roundtrip";
  pickupLocation: Location | null;
  dropLocation: Location | null;
  rideStartDate: string;
  rideStartTime: string;
  rideEndDate: string;
  rideEndTime: string;
  searchRadiusKm: number;
  gearType: string;
  bodyType: string;
  timeRequired: number;
}

export interface RideMatchData {
  rideId: string;
  data?: {
    rideId: string;
  };
}

export interface SearchProgressUpdate {
  requestGroupId: string;
  currentIndex: number;
  totalCandidates: number;
  message: string;
  status: "SEARCHING" | "COMPLETED" | "EXPIRED";
}
