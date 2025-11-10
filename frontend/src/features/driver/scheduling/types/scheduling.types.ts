export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface ScheduleData {
  availableFrom: string; // ISO string
  availableTill: string; // ISO string
  currentLocation: Location;
}

export interface UpdateLocationPayload {
  driverId: string | null;
  currentLocation: Location;
}

export interface UpdateStatusPayload {
  driverId: string | null;
  status: "Available" | "Busy" | "Offline";
}

export interface ScheduleFormData {
  availableFrom: Date | null;
  availableTill: Date | null;
  location: Location | null;
}

export interface GeocodeResult {
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

// Backend API Response Types
export interface AvailabilityData {
  id: string;
  driverId: string;
  availabilityStatus: "Available" | "Busy" | "Offline";
  availableFrom: string;
  availableTill: string;
  currentLocation: Location;
  updatedAt: string;
}

export interface DriverStatusResponse {
  success: boolean;
  message: string;
  data: AvailabilityData;
  type?: string;
}

export interface AvailabilityNotFoundResponse {
  success: boolean;
  message: string;
  type: "NOT_FOUND_ERROR";
}

export interface SchedulingState {
  availability: AvailabilityData | null;
  driverId: string | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  hasAvailability: boolean;
}
