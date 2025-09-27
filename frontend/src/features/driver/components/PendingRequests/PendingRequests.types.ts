import type { RideRequest } from "../../types/driver.types";

export interface PendingRequestsProps {
  requests: RideRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  loading?: boolean;
  className?: string;
}
