import type { RideRequest } from "../../types/driver.types";

export interface RequestCardProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  loading?: boolean;
}
