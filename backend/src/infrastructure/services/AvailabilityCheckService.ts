import { injectable, inject } from "inversify";
import { IAvailabilityCheckService } from "@application/services/IAvailabilityCheckService";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { DriverAvailability } from "@domain/entities/DriverAvailability";

@injectable()
export class AvailabilityCheckService implements IAvailabilityCheckService {
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository
  ) {}

  async isAvailableDuring(
    driverId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const availability =
      await this.availabilityRepository.findActiveByDriverId(driverId);

    if (!availability) return false;

    const durationMinutes = (endDate.getTime() - startDate.getTime()) / 60000;

    return this.isDriverAvailableForDuration(
      availability,
      startDate,
      durationMinutes
    );
  }

  private isDriverAvailableForDuration(
    availability: DriverAvailability,
    searchDate: Date,
    timeRequiredMinutes: number
  ): boolean {
    const schedule = availability.getRecurringSchedule();
    if (!schedule) return false;

    const rideEnd = new Date(searchDate);
    rideEnd.setMinutes(rideEnd.getMinutes() + timeRequiredMinutes);

    const exceptions = availability.getExceptions?.() ?? [];
    for (const exception of exceptions) {
      const exceptionStart = new Date(exception.startTime);
      const exceptionEnd = new Date(exception.endTime);
      if (searchDate < exceptionEnd && rideEnd > exceptionStart) {
        return false;
      }
    }

    const validFrom = new Date(schedule.validity.startDate);
    const validTill = new Date(
      schedule.validity.endDate ?? new Date(9999, 11, 31)
    );

    if (searchDate < validFrom || rideEnd > validTill) {
      return false;
    }

    const daily = schedule.dailyRecurrence;
    if (!daily) return false;

    const jsDay = searchDate.getUTCDay();
    const normalizedDay = jsDay === 0 ? 7 : jsDay;

    if (!daily.daysOfWeek.includes(normalizedDay)) {
      return false;
    }

    const startMinutes =
      searchDate.getUTCHours() * 60 + searchDate.getUTCMinutes();
    const endMinutes = startMinutes + timeRequiredMinutes;

    const fitsInSlot = daily.timeSlots.some(
      (slot) =>
        startMinutes >= slot.getStartTime() && endMinutes <= slot.getEndTime()
    );

    if (!fitsInSlot) return false;

    if (daily.excludedTimeSlots?.length) {
      const overlapsExcluded = daily.excludedTimeSlots.some(
        (slot) =>
          startMinutes < slot.getEndTime() && endMinutes > slot.getStartTime()
      );
      if (overlapsExcluded) return false;
    }

    return true;
  }
}
