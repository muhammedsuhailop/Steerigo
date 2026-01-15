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
    const names = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return names[day];
  }

  static getCurrentDayOfWeekUtc(): DayOfWeek {
    return new Date().getUTCDay() as DayOfWeek;
  }

  static getDayFromDateUtc(date: Date): DayOfWeek {
    return date.getUTCDay() as DayOfWeek;
  }
}
