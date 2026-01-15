export class ScheduleValidityHelper {
  static isValidityActive(
    validity: {
      startDate: Date;
      endDate?: Date | null;
    },
    now: Date
  ): boolean {
    return (
      now >= validity.startDate &&
      (!validity.endDate || now <= validity.endDate)
    );
  }

  static isSchedulePending(startDate: Date, now: Date): boolean {
    return startDate > now;
  }

  static getTodayDayOfWeek(): number {
    return new Date().getDay();
  }
}
