export interface IAvailabilityCheckService {
  isAvailableDuring(
    driverId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean>;
}
