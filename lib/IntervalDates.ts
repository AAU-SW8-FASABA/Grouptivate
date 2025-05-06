import { Interval } from "./API/schemas/Interval";

export function getStartDateFromInterval(interval: Interval): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  switch (interval) {
    case Interval.Monthly: {
      date.setDate(1);
      break;
    }
    case Interval.Weekly: {
      date.setDate(date.getDate() - date.getDay());
      break;
    }
  }
  return date;
}

export function getEndDateFromInterval(interval: Interval): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  switch (interval) {
    case Interval.Monthly: {
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
      break;
    }
    case Interval.Weekly: {
      date.setDate(date.getDate() + (6 - date.getDay()) + 1);
      break;
    }
    case Interval.Daily: {
      date.setDate(date.getDate() + 1);
    }
  }
  return date;
}

export function getDaysLeftInInterval(interval: Interval): number {
  const timeDiff = getEndDateFromInterval(interval).getTime() - Date.now();
  return timeDiff / (1000 * 60 * 60 * 24);
}
