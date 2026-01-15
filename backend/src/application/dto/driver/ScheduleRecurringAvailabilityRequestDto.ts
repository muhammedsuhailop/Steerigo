import { z } from "zod";
import { DayOfWeek } from "@domain/value-objects/DayOfWeek";
import { TimeSlot } from "@domain/value-objects/TimeSlot";

const timeSlotSchema = z.object({
  startTime: z.number().int().min(0).max(1440),
  endTime: z.number().int().min(0).max(1440),
});

const scheduleRecurringAvailabilitySchema = z.object({
  daysOfWeek: z
    .array(z.number().int().min(0).max(6))
    .min(1, "At least one day must be selected"),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot must be defined"),
  excludedTimeSlots: z.array(timeSlotSchema).optional(),
  validityStartDate: z.string().datetime("Invalid datetime format"),
  validityEndDate: z.string().datetime("Invalid datetime format").optional(),
  notes: z.string().max(1000).optional(),
  currentLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().max(500).optional(),
  }),
});

type ScheduleRecurringAvailabilityData = z.infer<
  typeof scheduleRecurringAvailabilitySchema
>;

export class ScheduleRecurringAvailabilityRequestDto {
  private readonly userId: string;
  private readonly data: ScheduleRecurringAvailabilityData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = scheduleRecurringAvailabilitySchema.parse(requestData);
  }

  static fromRequest(
    userId: string,
    requestBody: unknown
  ): ScheduleRecurringAvailabilityRequestDto {
    return new ScheduleRecurringAvailabilityRequestDto(userId, requestBody);
  }

  getUserId(): string {
    return this.userId;
  }

  getDaysOfWeek(): DayOfWeek[] {
    return this.data.daysOfWeek as DayOfWeek[];
  }

  getTimeSlots(): TimeSlot[] {
    return this.data.timeSlots.map((slot) =>
      TimeSlot.create(slot.startTime, slot.endTime)
    );
  }

  getExcludedTimeSlots(): TimeSlot[] {
    return (
      this.data.excludedTimeSlots?.map((slot) =>
        TimeSlot.create(slot.startTime, slot.endTime)
      ) || []
    );
  }

  getValidityStartDate(): Date {
    return new Date(this.data.validityStartDate);
  }

  getValidityEndDate(): Date | null {
    return this.data.validityEndDate
      ? new Date(this.data.validityEndDate)
      : null;
  }

  getNotes(): string | undefined {
    return this.data.notes;
  }

  getLocationData(): {
    latitude: number;
    longitude: number;
    address?: string;
  } {
    return this.data.currentLocation;
  }

  validate(): string[] {
    const errors: string[] = [];
    const now = new Date();

    // Validate start date
    if (this.getValidityStartDate() < now) {
      errors.push("Validity start date cannot be in the past");
    }

    // Validate time slots
    const timeSlots = this.getTimeSlots();
    for (const slot of timeSlots) {
      if (slot.getStartTime() === slot.getEndTime()) {
        errors.push("Time slot start and end times cannot be the same");
      }
    }

    // Validate no overlapping time slots
    for (let i = 0; i < timeSlots.length; i++) {
      for (let j = i + 1; j < timeSlots.length; j++) {
        if (this.timeSlotsOverlap(timeSlots[i], timeSlots[j])) {
          errors.push(`Time slot ${i + 1} and ${j + 1} overlap`);
        }
      }
    }

    return errors;
  }

  private timeSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
    const s1Start = slot1.getStartTime();
    const s1End = slot1.getEndTime();
    const s2Start = slot2.getStartTime();
    const s2End = slot2.getEndTime();

    if (s1Start <= s1End && s2Start <= s2End) {
      return !(s1End <= s2Start || s2End <= s1Start);
    }

    return false;
  }
}
