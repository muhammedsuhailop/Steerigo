export class TimeSlotHelper {
  static minutesToTimeSlot(
    startMinutes: number,
    endMinutes: number
  ): { startTime: string; endTime: string; durationMinutes: number } {
    const format = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0"
      )}`;
    };

    return {
      startTime: format(startMinutes),
      endTime: format(endMinutes),
      durationMinutes: endMinutes - startMinutes,
    };
  }

  static getDayLabels(daysOfWeek: number[]): string[] {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek.map((day) => dayNames[day]);
  }

  static parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }

  static hasTimeOverlap(
    excStart: Date,
    excEnd: Date,
    slotStartTime: string,
    slotEndTime: string
  ): boolean {
    const excStartMinutes = excStart.getHours() * 60 + excStart.getMinutes();
    const excEndMinutes = excEnd.getHours() * 60 + excEnd.getMinutes();

    const slotStartMinutes = this.parseTime(slotStartTime);
    const slotEndMinutes = this.parseTime(slotEndTime);

    return !(
      excEndMinutes <= slotStartMinutes || excStartMinutes >= slotEndMinutes
    );
  }
}
