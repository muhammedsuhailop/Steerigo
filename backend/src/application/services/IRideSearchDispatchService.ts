export interface DispatchRideRequestInput {
  requestGroupId: string;
  driverId: string;
  riderId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  pickupTime: Date;
  rideType: string;
  fare: {
    amount: number;
    currency: string;
  };
  fareBreakdown: unknown;
  pickupETA: string;
  searchedAt: Date;
}

export interface RideSearchProgressPayload {
  requestGroupId: string;
  riderId: string;
  currentIndex: number;
  totalCandidates: number;
  status: "SEARCHING" | "COMPLETED" | "EXPIRED";
  message: string;
}

export interface IRideSearchDispatchService {
  dispatchNextRequest(
    requestGroupId: string,
    currentIndexOverride?: number,
  ): Promise<void>;

  scheduleGroupGuards(requestGroupId: string): Promise<void>;

  cancelGroupJobs(requestGroupId: string): Promise<void>;

  publishSearchProgress(payload: RideSearchProgressPayload): Promise<void>;
}