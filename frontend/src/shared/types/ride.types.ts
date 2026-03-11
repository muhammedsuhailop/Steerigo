export type RideStatus =
  | "Pending"
  | "Accepted"
  | "Arrived"
  | "Started"
  | "Completed"
  | "Cancelled"
  | "Arrived";

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
