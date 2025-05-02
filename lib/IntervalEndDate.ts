import { Interval } from "./API/schemas/Interval";

export function getDaysLeftInterval(interval: Interval): number {
  const today = new Date();
  let daysUntilInterval: number = 1;
  switch (interval) {
    case Interval.Monthly: {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      daysUntilInterval = Math.ceil(
        (nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      break;
    }
    case Interval.Weekly: {
      daysUntilInterval = (8 - today.getDay()) % 7 || 7;
    }
  }
  return daysUntilInterval;
}
