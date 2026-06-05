export interface AdminUserStats {
  totalUsers: number;
  newUsers: number;
  fromDate: string;
  toDate: string;
}

export interface DailyRideStat {
  date: string;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  revenue: number;
}

export interface AdminGraphData {
  ridesOverTime: DailyRideStat[];
}

export interface AdminRideStats {
  fromDate: string;
  toDate: string;
  rideStats: {
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
    totalAmount: number;
    currency: string;
  };
  ratingStats: {
    averageRating: number;
    totalRatings: number;
    distribution: {
      zeroToOne: number;
      oneToTwo: number;
      twoToThree: number;
      threeToFour: number;
      fourToFive: number;
    };
  };
  graphData?: AdminGraphData;
}

export interface AdminDriverStats {
  fromDate: string;
  toDate: string;
  driverStats: {
    totalDrivers: number;
    newDrivers: number;
    statusBreakdown: {
      active: number;
      blocked: number;
      suspended: number;
    };
    kycBreakdown: {
      approved: number;
      inReview: number;
      rejected: number;
    };
  };
}

export interface AdminStatsResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
