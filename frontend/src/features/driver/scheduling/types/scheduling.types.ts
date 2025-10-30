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
  driverId: string;
  currentLocation: Location;
}

export interface UpdateStatusPayload {
  driverId: string;
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
