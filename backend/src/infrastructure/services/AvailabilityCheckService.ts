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
    try {
      const availability =
        await this.availabilityRepository.findActiveByDriverId(driverId);

      if (!availability) {
        Logger.debug("No active availability found", { driverId });
        return false;
      }

      const isAvailable = availability.isAvailableAt(checkDate);
      Logger.debug("Availability check result", {
        driverId,
        checkDate: checkDate.toISOString(),
        isAvailable,
      });

      return isAvailable;
    } catch (error) {
      Logger.error("Error checking driver availability", {
        driverId,
        checkDate,
        error,
      });
      return false;
    }
  }

  async getNextAvailableSlot(
    driverId: string,
    fromDate: Date
  ): Promise<{ startTime: Date; endTime: Date } | null> {
    try {
      const availability =
        await this.availabilityRepository.findActiveByDriverId(driverId);

      if (!availability) {
        return null;
      }

      const recurringSchedule = availability.getRecurringSchedule();
      if (!recurringSchedule) {
        return null;
      }

      // Search forward from the given date
      let checkDate = new Date(fromDate);
      const maxDaysToCheck = 365; // Look ahead up to 1 year

      for (let i = 0; i < maxDaysToCheck; i++) {
        const dayOfWeek = checkDate.getDay();

        // Check if this day is in the recurring schedule
        if (recurringSchedule.dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
          // Get first available time slot for this day
          const slot = recurringSchedule.dailyRecurrence.timeSlots[0];
          if (slot) {
            const startHours = Math.floor(slot.getStartTime() / 60);
            const startMinutes = slot.getStartTime() % 60;
            const endHours = Math.floor(slot.getEndTime() / 60);
            const endMinutes = slot.getEndTime() % 60;

            const slotStartTime = new Date(checkDate);
            slotStartTime.setHours(startHours, startMinutes, 0, 0);

            const slotEndTime = new Date(checkDate);
            slotEndTime.setHours(endHours, endMinutes, 0, 0);

            // Verify this slot doesn't have exceptions
            if (availability.isAvailableAt(slotStartTime)) {
              Logger.info("Found next available slot", {
                driverId,
                startTime: slotStartTime.toISOString(),
                endTime: slotEndTime.toISOString(),
              });

              return {
                startTime: slotStartTime,
                endTime: slotEndTime,
              };
            }
          }
        }

        checkDate.setDate(checkDate.getDate() + 1);
      }

      Logger.warn("No available slot found within search period", {
        driverId,
        maxDaysToCheck,
      });
      return null;
    } catch (error) {
      Logger.error("Error getting next available slot", {
        driverId,
        fromDate,
        error,
      });
      return null;
    }
  }

  async isAvailableDuring(
    driverId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    try {
      if (startDate >= endDate) {
        return false;
      }

      const availability =
        await this.availabilityRepository.findActiveByDriverId(driverId);

      if (!availability) {
        return false;
      }

      // Check availability at multiple points during the range
      const checkPoints: Date[] = [startDate];

      // Add midpoint for long durations
      const durationHours =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

      if (durationHours > 1) {
        const midpoint = new Date(
          startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2
        );
        checkPoints.push(midpoint);
      }

      // Always check end time
      checkPoints.push(new Date(endDate.getTime() - 1000)); // 1 second before end

      // Verify availability at all check points
      for (const checkDate of checkPoints) {
        if (!availability.isAvailableAt(checkDate)) {
          Logger.debug("Driver not available during range", {
            driverId,
            failedAtTime: checkDate.toISOString(),
          });
          return false;
        }
      }

      Logger.info("Driver available for entire duration", {
        driverId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      return true;
    } catch (error) {
      Logger.error("Error checking availability during range", {
        driverId,
        startDate,
        endDate,
        error,
      });
      return false;
    }
  }
}
