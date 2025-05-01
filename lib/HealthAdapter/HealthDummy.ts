import { array, parse } from "valibot";
import {
  CaloriesOnlyOptions,
  CountOnlyInsertOptions,
  CountOnlyOptions,
  HealthAdapter,
  isCaloriesOnlyOptions,
  isCountOnlyInsertOptions,
  isCountOnlyOptions,
  isSportInsertOptions,
  isSportOptions,
  PermissionLevel,
  SportInsertOptions,
  SportOptions,
} from "./HealthAdapter";
import { Metric } from "../API/schemas/Metric";
import {
  HealthRecord,
  HealthRecordSchema,
} from "./HealthDummy/HealthDummyRecord";

const HEALTH_DUMMY_STORAGE_KEY = "HEALTH_DUMMY_RECORDS";

/**
 * The `HealthDummyAdapter` class provides methods for initializing, retrieving, and inserting
 * health-related data for testing of the app in a browser.
 */
export class HealthDummyAdapter extends HealthAdapter {
  #isInitialized = false;
  #permissionGranted = PermissionLevel.None;
  get permissionGranted(): PermissionLevel {
    return this.#permissionGranted;
  }

  /**
   * Check if saving dummy data is available on the given platform
   * @returns Promise<boolean>
   */
  static async isAvailable(): Promise<boolean> {
    return "localStorage" in globalThis;
  }

  /**
   * The `init` function pretends to initialize the health SDK and request permissions.
   *
   * @param {boolean} [requestWrite=false] - The `requestWrite` parameter in the `init` function is a
   * boolean parameter that determines whether to request write permission. This is only used for dev testing.
   */
  async init(requestWrite: boolean = false): Promise<void> {
    this.#isInitialized = true;
    this.#permissionGranted = requestWrite
      ? PermissionLevel.ReadWrite
      : PermissionLevel.Read;
  }

  /**
   *
   * @param {CaloriesOnlyOptions | CountOnlyOptions | SportOptions} options
   *
   * @returns The `getData` function returns an amount of the given activity
   */
  async getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions,
  ): Promise<number> {
    if (!this.#isInitialized) {
      throw Error("HealthDummy is not initialized");
    }
    if (
      !isSportOptions(options) &&
      !isCaloriesOnlyOptions(options) &&
      !isCountOnlyOptions(options)
    ) {
      throw new Error("Invalid options object");
    }
    let records: HealthRecord[] = [];
    try {
      const storedRecords = localStorage.getItem(HEALTH_DUMMY_STORAGE_KEY);
      if (storedRecords === null) return 0;
      records = parse(array(HealthRecordSchema), JSON.parse(storedRecords));
    } catch (error) {
      throw new Error(
        `Unable to read health records: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
    const start = options.startDate.getTime();
    const end = options.endDate.getTime();
    let result = 0;
    for (const record of records) {
      if (record.activity !== options.activity) continue;
      if (
        record.start < start ||
        record.end < start ||
        end < record.start ||
        end < record.end
      )
        continue;
      switch (options.metric) {
        case Metric.Duration: {
          result += Math.floor((record.end - record.start) / 1000);
          break;
        }
        case Metric.Distance: {
          result += record.distance ?? 0;
          break;
        }
        case Metric.Count: {
          if (isSportOptions(options)) {
            result += 1;
          } else if (isCountOnlyOptions(options)) {
            result += record.count ?? 0;
          }
          break;
        }
        case Metric.Calories: {
          result += record.caloriesBurned ?? 0;
          break;
        }
      }
    }
    return result;
  }

  /**
   * The `insertData` function inserts health data records based on the provided options.
   *
   * @param {InsertOptions} [options] - The `insertData` function is an asynchronous function that takes
   * an optional parameter `data` of type `InsertOptions`.
   */
  async insertData(
    options?: CountOnlyInsertOptions | SportInsertOptions,
  ): Promise<void> {
    if (!this.#isInitialized) {
      throw Error("HealthDummy is not initialized");
    }
    if (!options) return;
    let records: HealthRecord[] = [];
    try {
      const storedRecords = localStorage.getItem(HEALTH_DUMMY_STORAGE_KEY);
      if (storedRecords === null) {
        records = [];
      } else {
        records = parse(array(HealthRecordSchema), JSON.parse(storedRecords));
      }
    } catch (error) {
      throw new Error(
        `Unable to read health records: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
    const record: HealthRecord = {
      start: options.startDate.getTime(),
      end: options.endDate.getTime(),
      activity: options.activity,
    };
    if (isSportInsertOptions(options)) {
      record.caloriesBurned = options.caloriesBurned;
      record.distance = options.distance;
    } else if (isCountOnlyInsertOptions(options)) {
      record.count = options.count;
    } else {
      throw new Error("Invalid options object");
    }
    records.push(record);
    localStorage.setItem(HEALTH_DUMMY_STORAGE_KEY, JSON.stringify(records));
  }
}
