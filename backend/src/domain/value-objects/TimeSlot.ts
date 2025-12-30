/**
 * TimeSlot Value Object
 * Represents a time slot within a day (stored as minutes from midnight)
 */
export class TimeSlot {
  private readonly startTime: number; // 0-1440 minutes
  private readonly endTime: number; // 0-1440 minutes

  private constructor(startTime: number, endTime: number) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  static create(startTime: number, endTime: number): TimeSlot {
    this.validate(startTime, endTime);
    return new TimeSlot(startTime, endTime);
  }

  private static validate(startTime: number, endTime: number): void {
    // Validate range
    if (startTime < 0 || startTime > 1440) {
      throw new Error("Start time must be between 0 and 1440 minutes");
    }

    if (endTime < 0 || endTime > 1440) {
      throw new Error("End time must be between 0 and 1440 minutes");
    }

    // For regular slots, end must be after start
    // For wrap-around slots (e.g., 10 PM to 5 AM), startTime > endTime is allowed
    if (startTime === endTime) {
      throw new Error("Start time and end time cannot be the same");
    }
  }

  static fromMinutes(startMinutes: number, endMinutes: number): TimeSlot {
    return TimeSlot.create(startMinutes, endMinutes);
  }

  getStartTime(): number {
    return this.startTime;
  }

  getEndTime(): number {
    return this.endTime;
  }

  /**
   * Check if this slot contains a given time
   * Handles both normal and wrap-around slots
   */
  containsTime(minutes: number): boolean {
    if (this.startTime <= this.endTime) {
      // Normal slot: e.g., 5 AM (300) to 10 PM (1320)
      return minutes >= this.startTime && minutes < this.endTime;
    } else {
      // Wrap-around slot: e.g., 10 PM (1320) to 5 AM (300)
      return minutes >= this.startTime || minutes < this.endTime;
    }
  }

  /**
   * Convert time object to minutes from midnight
   */
  static timeToMinutes(hours: number, minutes: number = 0): number {
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid time");
    }
    return hours * 60 + minutes;
  }

  /**
   * Convert minutes from midnight to HH:MM format
   */
  static minutesToTime(minutes: number): string {
    if (minutes < 0 || minutes > 1440) {
      throw new Error("Minutes must be between 0 and 1440");
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  toDTO() {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      displayStartTime: TimeSlot.minutesToTime(this.startTime),
      displayEndTime: TimeSlot.minutesToTime(this.endTime),
    };
  }
}
