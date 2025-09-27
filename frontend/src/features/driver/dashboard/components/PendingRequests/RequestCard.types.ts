import type { RideRequest } from "../../../shared/types/driver.types";

export interface RequestCardProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  loading?: boolean;
}
