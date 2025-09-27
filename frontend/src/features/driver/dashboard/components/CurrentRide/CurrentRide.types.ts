import type { CurrentRide } from "../../../shared/types/driver.types";

export interface CurrentRideProps {
  ride: CurrentRide;
  onUpdateStatus: (rideId: string, status: CurrentRide["status"]) => void;
  loading?: boolean;
  className?: string;
}
