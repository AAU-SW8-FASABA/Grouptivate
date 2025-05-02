import { Interval } from "./API/schemas/Interval";

export function getStartDateFromInterval(interval: Interval): Date {
    const date = new Date();
    switch (interval) {
      case Interval.Monthly: {
        date.setDate(0);
        break;
      }
      case Interval.Weekly: {
        date.setDate(date.getDate() - date.getDay());
        break;
      }
    }
    date.setHours(0, 0, 0, 0);
    return date;
  }