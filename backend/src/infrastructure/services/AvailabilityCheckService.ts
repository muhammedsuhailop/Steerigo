import { injectable, inject } from "inversify";
import { IAvailabilityCheckService } from "@application/services/IAvailabilityCheckService";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class AvailabilityCheckService implements IAvailabilityCheckService {
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository
  ) {}

  async isDriverAvailable(driverId: string, checkDate: Date): Promise<boolean> {
    const availability =
      await this.availabilityRepository.findActiveByDriverId(driverId);

    if (!availability) return false;

    return availability.isAvailableAt(checkDate);
  }

  async isAvailableDuring(
    driverId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const availability =
      await this.availabilityRepository.findActiveByDriverId(driverId);

    if (!availability) {
      Logger.debug("No active availability found", { driverId });
      return false;
    }

    const isAvailable = availability.isAvailableForTimeRange(
      startDate,
      endDate
    );

    Logger.debug("Availability range check result", {
      driverId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isAvailable,
    });

    return isAvailable;
  }

  async getNextAvailableSlot(
    driverId: string,
    fromDate: Date
  ): Promise<{ startTime: Date; endTime: Date } | null> {
    const availability =
      await this.availabilityRepository.findActiveByDriverId(driverId);

    if (!availability) return null;

    const recurring = availability.getRecurringSchedule();
    if (!recurring) return null;

    let cursor = new Date(fromDate);

    for (let i = 0; i < 365; i++) {
      for (const slot of recurring.dailyRecurrence.timeSlots) {
        const start = new Date(cursor);
        start.setUTCHours(
          Math.floor(slot.getStartTime() / 60),
          slot.getStartTime() % 60,
          0,
          0
        );

        const end = new Date(cursor);
        end.setUTCHours(
          Math.floor(slot.getEndTime() / 60),
          slot.getEndTime() % 60,
          0,
          0
        );

        if (availability.isAvailableForTimeRange(start, end)) {
          return { startTime: start, endTime: end };
        }
      }

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return null;
  }
}
