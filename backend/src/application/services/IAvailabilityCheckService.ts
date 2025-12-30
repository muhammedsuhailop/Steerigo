export interface IAvailabilityCheckService {
  isDriverAvailable(driverId: string, checkDate: Date): Promise<boolean>;

  getNextAvailableSlot(
    driverId: string,
    fromDate: Date
  ): Promise<{ startTime: Date; endTime: Date } | null>;

  isAvailableDuring(
    driverId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean>;
}
