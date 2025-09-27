import type { RideRequest } from "../../../shared/types/driver.types";

export interface PendingRequestsProps {
  requests: RideRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  loading?: boolean;
  className?: string;
}
