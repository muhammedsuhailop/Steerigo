import {
  DriverAvailability,
  RecurringScheduleData,
} from "@domain/entities/DriverAvailability";
import { IDriverAvailabilityModel } from "../models/DriverAvailabilityModel";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { Location } from "@domain/value-objects/Location";
import { TimeSlot } from "@domain/value-objects/TimeSlot";
import { Types } from "mongoose";

export class DriverAvailabilityMapper {
  static toDomain(raw: IDriverAvailabilityModel): DriverAvailability {
    const location = Location.create({
      latitude: raw.currentLocation.latitude,
      longitude: raw.currentLocation.longitude,
      address: raw.currentLocation.address,
    });

    // Convert time slots if present
    const timeSlots =
      raw.recurringSchedule?.dailyRecurrence.timeSlots.map((slot) =>
        TimeSlot.create(slot.startTime, slot.endTime)
      ) || [];

    const excludedTimeSlots = raw.recurringSchedule?.dailyRecurrence
      .excludedTimeSlots
      ? raw.recurringSchedule.dailyRecurrence.excludedTimeSlots.map((slot) =>
          TimeSlot.create(slot.startTime, slot.endTime)
        )
      : undefined;

    // Build recurring schedule if present
    const recurringSchedule: RecurringScheduleData | undefined =
      raw.recurringSchedule
        ? {
            dailyRecurrence: {
              daysOfWeek: raw.recurringSchedule.dailyRecurrence.daysOfWeek,
              timeSlots,
              excludedTimeSlots,
            },
            validity: raw.recurringSchedule.validity,
            notes: raw.recurringSchedule.notes,
          }
        : undefined;

    return DriverAvailability.fromData({
      id: raw._id.toString(),
      driverId: raw.driverId.toString(),
      status: raw.status as AvailabilityStatus,
      currentLocation: location,
      recurringSchedule,
      exceptions: raw.exceptions || [],
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(
    availability: DriverAvailability
  ): Partial<IDriverAvailabilityModel> {
    const location = availability.getCurrentLocation();
    const coordinates = location.getCoordinates();
    const recurringSchedule = availability.getRecurringSchedule();

    const persistenceData: Partial<IDriverAvailabilityModel> = {
      id: availability.getId() as unknown as Types.ObjectId,
      driverId: new Types.ObjectId(availability.getDriverId()),
      status: availability.getStatus() as unknown as string,
      currentLocation: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: coordinates.address,
        updatedAt: new Date(),
      },
      exceptions: availability.getExceptions(),
      isActive: availability.getIsActive(),
      updatedAt: availability.getUpdatedAt(),
    };

    if (recurringSchedule) {
      persistenceData.recurringSchedule = {
        dailyRecurrence: {
          daysOfWeek: recurringSchedule.dailyRecurrence.daysOfWeek,
          timeSlots: recurringSchedule.dailyRecurrence.timeSlots.map(
            (slot) => ({
              startTime: slot.getStartTime(),
              endTime: slot.getEndTime(),
            })
          ),
          excludedTimeSlots:
            recurringSchedule.dailyRecurrence.excludedTimeSlots?.map(
              (slot) => ({
                startTime: slot.getStartTime(),
                endTime: slot.getEndTime(),
              })
            ),
        },
        validity: recurringSchedule.validity,
        notes: recurringSchedule.notes,
      };
    } else {
      persistenceData.recurringSchedule = null as unknown as undefined;
    }

    return persistenceData;
  }
}
