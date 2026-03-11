export enum RideStatus {
  REQUESTED = "Requested",
  ACCEPTED = "Accepted",
  STARTED = "Started",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  REJECTED = "Rejected",
  ARRIVED = "Arrived",
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
