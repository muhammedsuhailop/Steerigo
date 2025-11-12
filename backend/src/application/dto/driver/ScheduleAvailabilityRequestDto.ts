import { z } from "zod";

const scheduleAvailabilitySchema = z.object({
  availableFrom: z
    .string()
    .datetime("Invalid datetime format for availableFrom"),
  availableTill: z
    .string()
    .datetime("Invalid datetime format for availableTill"),
  currentLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().max(500).optional(),
  }),
});

type ScheduleAvailabilityData = z.infer<typeof scheduleAvailabilitySchema>;

export class ScheduleAvailabilityRequestDto {
  private readonly data: ScheduleAvailabilityData;

  constructor(requestData: any) {
    this.data = scheduleAvailabilitySchema.parse(requestData);
  }

  getAvailableFrom(): Date {
    return new Date(this.data.availableFrom);
  }

  getAvailableTill(): Date {
    return new Date(this.data.availableTill);
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
    const availableFrom = this.getAvailableFrom();
    const availableTill = this.getAvailableTill();

    if (availableFrom < now) {
      errors.push("Available from time cannot be in the past");
    }

    if (availableTill <= availableFrom) {
      errors.push("Available till time must be after available from time");
    }

    const maxDuration = 168 * 60 * 60 * 1000; // 7 days
    if (availableTill.getTime() - availableFrom.getTime() > maxDuration) {
      errors.push("Availability duration cannot exceed 7 days");
    }

    return errors;
  }
}
