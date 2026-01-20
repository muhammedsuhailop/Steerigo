export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export class DayOfWeekUtils {
  static isValidDay(day: number): boolean {
    return day >= 0 && day <= 6;
  }

  static getDayName(day: DayOfWeek): string {
    const names: Record<DayOfWeek, string> = {
      [DayOfWeek.SUNDAY]: "Sunday",
      [DayOfWeek.MONDAY]: "Monday",
      [DayOfWeek.TUESDAY]: "Tuesday",
      [DayOfWeek.WEDNESDAY]: "Wednesday",
      [DayOfWeek.THURSDAY]: "Thursday",
      [DayOfWeek.FRIDAY]: "Friday",
      [DayOfWeek.SATURDAY]: "Saturday",
    };
    return names[day];
  }

  static getCurrentDayOfWeekUtc(): DayOfWeek {
    return new Date().getUTCDay() as DayOfWeek;
  }

  static getDayFromDateUtc(date: Date): DayOfWeek {
    return date.getUTCDay() as DayOfWeek;
  }
}
