import { AvailabilityData } from "../../scheduling/types/scheduling.types";

export type DayAvailability = {
  date: Date;
  isAvailable: boolean;
};

export function getNext7DaysAvailability(
  availabilityData: AvailabilityData
): DayAvailability[] {
  const result: DayAvailability[] = [];
  const today = new Date();

  const { recurringSchedule } = availabilityData;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    let isAvailable = false;

    if (
      recurringSchedule?.isActive &&
      recurringSchedule.validity.isCurrentlyValid
    ) {
      const dayOfWeek = date.getDay(); // 0 Sun → 6 Sat

      isAvailable =
        recurringSchedule.dailyRecurrence.daysOfWeek.includes(dayOfWeek);
    }

    result.push({ date, isAvailable });
  }

  return result;
}
