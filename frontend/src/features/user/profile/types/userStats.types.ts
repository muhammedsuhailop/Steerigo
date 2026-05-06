export interface RideStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalSpend: number;
  currency: string;
}

export interface RatingDistribution {
  zeroToOne: number;
  oneToTwo: number;
  twoToThree: number;
  threeToFour: number;
  fourToFive: number;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistribution;
}

export interface UserStats {
  userId: string;
  fromDate: string;
  toDate: string;
  rideStats: RideStats;
  ratingStats: RatingStats;
}
