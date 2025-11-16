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

export interface Driver {
  id: string;
  userId: string;
  name: string;
  mobile: string;
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
  searchCriteria: SearchCriteria | null;
  isLoading: boolean;
  error: string | null;
  totalFound: number;
  searchedAt: string | null;
}

export interface TripFormData {
  tripType: "oneway" | "roundtrip";
  pickupLocation: Location | null;
  dropLocation: Location | null;
  rideStartDate: string;
  rideStartTime: string;
  searchRadiusKm: number;
  gearType: string;
  bodyType: string;
  timeRequired: number;
}
