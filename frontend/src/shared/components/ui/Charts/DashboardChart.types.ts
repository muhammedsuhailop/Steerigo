export interface TimelineChartItem {
  date: string;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  revenue: number;
}

export interface SharedRideStatsSummary {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalAmount: number;
  currency: string;
}
