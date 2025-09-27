import type { CurrentRide } from "../../types/driver.types";

export interface CurrentRideProps {
  ride: CurrentRide;
  onUpdateStatus: (rideId: string, status: CurrentRide["status"]) => void;
  loading?: boolean;
  className?: string;
}
