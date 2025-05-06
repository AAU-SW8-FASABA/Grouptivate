import { Interval } from "../API/schemas/Interval";
import {
  getStartDateFromInterval,
  getEndDateFromInterval,
} from "../IntervalDates";

jest.useFakeTimers();

describe("getStartDateFromInterval", () => {
  it("daily interval start should be at midnight", async () => {
    const midnight = new Date(
      2025,
      4 /*may*/,
      7 /*wednesday*/,
      0 /*hour*/,
      0 /*minute*/,
      0 /*ms*/,
    ).toUTCString();

    jest.setSystemTime(new Date(2025, 4 /*may*/, 7 /*wednesday*/, 2, 0, 50));
    const earlyResult = getStartDateFromInterval(Interval.Daily);
    expect(earlyResult.toUTCString()).toStrictEqual(midnight);

    jest.setSystemTime(new Date(2025, 4 /*may*/, 7 /*wednesday*/, 11, 43, 0));
    const middleResult = getStartDateFromInterval(Interval.Daily);
    expect(middleResult.toUTCString()).toStrictEqual(midnight);

    jest.setSystemTime(new Date(2025, 4 /*may*/, 7 /*wednesday*/, 21, 59, 200));
    const lateResult = getStartDateFromInterval(Interval.Daily);
    expect(lateResult.toUTCString()).toStrictEqual(midnight);
  });

  it("weekly interval start should be on a sunday", async () => {
    const sunday = new Date(
      2025,
      4 /*may*/,
      4 /*sunday*/,
      0 /*hour*/,
      0 /*minute*/,
      0 /*ms*/,
    ).toUTCString();

    jest.setSystemTime(new Date(2025, 4 /*may*/, 4 /*sunday*/, 0, 4, 0));
    const earlyResult = getStartDateFromInterval(Interval.Weekly);
    expect(earlyResult.toUTCString()).toStrictEqual(sunday);

    jest.setSystemTime(new Date(2025, 4 /*may*/, 8 /*thursday*/, 13, 45, 0));
    const middleResult = getStartDateFromInterval(Interval.Weekly);
    expect(middleResult.toUTCString()).toStrictEqual(sunday);

    jest.setSystemTime(new Date(2025, 4 /*may*/, 10 /*saturday*/, 23, 58, 0));
    const lateResult = getStartDateFromInterval(Interval.Weekly);
    expect(lateResult.toUTCString()).toStrictEqual(sunday);
  });

  it("monthly interval start should be on the first day of the month", async () => {
    const june = new Date(
      2025,
      5 /*june*/,
      1 /*sunday*/,
      0 /*hour*/,
      0 /*minute*/,
      0 /*ms*/,
    ).toUTCString();

    jest.setSystemTime(new Date(2025, 5 /*june*/, 1 /*sunday*/, 12, 4, 0));
    const earlyResult = getStartDateFromInterval(Interval.Monthly);
    expect(earlyResult.toUTCString()).toStrictEqual(june);

    jest.setSystemTime(new Date(2025, 5 /*june*/, 13 /*friday*/, 1, 45, 0));
    const middleResult = getStartDateFromInterval(Interval.Monthly);
    expect(middleResult.toUTCString()).toStrictEqual(june);

    jest.setSystemTime(new Date(2025, 5 /*june*/, 30 /*monday*/, 13, 58, 0));
    const lateResult = getStartDateFromInterval(Interval.Monthly);
    expect(lateResult.toUTCString()).toStrictEqual(june);
  });
});

describe("getEndDateFromInterval", () => {
  it("daily interval end should be at midnight", async () => {
    const midnight = new Date(
      2025,
      4 /*may*/,
      8 /*thursday*/,
      0 /*hour*/,
      0 /*minute*/,
      0 /*ms*/,
    ).toUTCString();

    jest.setSystemTime(new Date(2025, 4 /*may*/, 7 /*wednesday*/, 2, 0, 50));
    const earlyResult = getEndDateFromInterval(Interval.Daily);
    expect(earlyResult.toUTCString()).toStrictEqual(midnight);

    jest.setSystemTime(new Date(2025, 4 /*may*/, 7 /*wednesday*/, 11, 43, 0));
    const middleResult = getEndDateFromInterval(Interval.Daily);
    expect(middleResult.toUTCString()).toStrictEqual(midnight);

    jest.setSystemTime(new Date(2025, 4 /*may*/, 7 /*wednesday*/, 21, 59, 200));
    const lateResult = getEndDateFromInterval(Interval.Daily);
    expect(lateResult.toUTCString()).toStrictEqual(midnight);
  });

  it("weekly interval end should be on a saturday", async () => {
    const sunday = new Date(
      2025,
      4 /*may*/,
      11 /*sunday*/,
      0 /*hour*/,
      0 /*minute*/,
      0 /*ms*/,
    ).toUTCString();

    jest.setSystemTime(new Date(2025, 4 /*may*/, 4 /*sunday*/, 0, 4, 0));
    const earlyResult = getEndDateFromInterval(Interval.Weekly);
    expect(earlyResult.toUTCString()).toStrictEqual(sunday);

    jest.setSystemTime(new Date(2025, 4 /*may*/, 8 /*thursday*/, 13, 45, 0));
    const middleResult = getEndDateFromInterval(Interval.Weekly);
    expect(middleResult.toUTCString()).toStrictEqual(sunday);

    jest.setSystemTime(new Date(2025, 4 /*may*/, 10 /*saturday*/, 23, 58, 0));
    const lateResult = getEndDateFromInterval(Interval.Weekly);
    expect(lateResult.toUTCString()).toStrictEqual(sunday);
  });

  it("monthly interval end should be on the last day of the month", async () => {
    const june = new Date(
      2025,
      6 /*july*/,
      1 /*tuesday*/,
      0 /*hour*/,
      0 /*minute*/,
      0 /*ms*/,
    ).toUTCString();

    jest.setSystemTime(new Date(2025, 5 /*june*/, 1 /*sunday*/, 12, 4, 0));
    const earlyResult = getEndDateFromInterval(Interval.Monthly);
    expect(earlyResult.toUTCString()).toStrictEqual(june);

    jest.setSystemTime(new Date(2025, 5 /*june*/, 13 /*friday*/, 1, 45, 0));
    const middleResult = getEndDateFromInterval(Interval.Monthly);
    expect(middleResult.toUTCString()).toStrictEqual(june);

    jest.setSystemTime(new Date(2025, 5 /*june*/, 30 /*monday*/, 13, 58, 0));
    const lateResult = getEndDateFromInterval(Interval.Monthly);
    expect(lateResult.toUTCString()).toStrictEqual(june);
  });
});
