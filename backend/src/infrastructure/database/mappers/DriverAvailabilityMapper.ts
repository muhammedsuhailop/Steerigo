import {
  DriverAvailability,
  RecurringScheduleData,
} from "@domain/entities/DriverAvailability";
import { AvailabilityException } from "@domain/entities/AvailabilityException";
import { IDriverAvailabilityModel } from "../models/DriverAvailabilityModel";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { RecurringPattern } from "@domain/value-objects/RecurringPattern";
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

    const exceptions: AvailabilityException[] = (raw.exceptions || []).map(
      (exception) => ({
        id: exception.id,
        type: exception.type as AvailabilityExceptionType,
        reason: exception.reason,

        startTime: new Date(exception.startTime),
        endTime: new Date(exception.endTime),

        isRecurring: exception.isRecurring ?? false,
        recurringPattern: exception.recurringPattern as
          | RecurringPattern
          | undefined,
        recurrenceStartDate: exception.recurrenceStartDate
          ? new Date(exception.recurrenceStartDate)
          : undefined,
        recurrenceEndDate: exception.recurrenceEndDate
          ? new Date(exception.recurrenceEndDate)
          : undefined,

        createdAt: new Date(exception.createdAt),
      })
    );

    return DriverAvailability.fromData({
      id: raw._id.toString(),
      driverId: raw.driverId.toString(),
      status: raw.status as AvailabilityStatus,
      currentLocation: location,
      recurringSchedule,
      exceptions,
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

      exceptions: availability.getExceptions().map((exception) => ({
        id: exception.id,
        type: exception.type,
        reason: exception.reason,

        startTime: exception.startTime,
        endTime: exception.endTime,

        isRecurring: exception.isRecurring,
        recurringPattern: exception.recurringPattern,

        recurrenceStartDate: exception.recurrenceStartDate,
        recurrenceEndDate: exception.recurrenceEndDate,

        createdAt: exception.createdAt,
      })),

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
