import { Platform } from "react-native";
import { HealthAdapter } from "./HealthAdapter";

export function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];

  // Create a new date object so we don't mutate the original
  let currentDate = new Date(startDate);

  // Loop until currentDate > endDate
  while (currentDate <= endDate) {
    // Push a new Date instance to avoid reference issues
    dates.push(new Date(currentDate));

    // Increment currentDate by one day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

let healthAdapterInitialised = false;
let _healthAdapter: HealthAdapter | undefined;
export async function getHealthAdapter(): Promise<HealthAdapter | undefined> {
  if (!healthAdapterInitialised) {
    if (Platform.OS === "android") {
      const { HealthConnectAdapter } = require("./HealthConnect");
      if (await HealthConnectAdapter.isAvailable()) {
        _healthAdapter = new HealthConnectAdapter();
      }
    } else if (Platform.OS === "ios") {
      const { HealthKitAdapter } = require("./HealthKit");
      if (await HealthKitAdapter.isAvailable()) {
        _healthAdapter = new HealthKitAdapter();
      }
    } else if (Platform.OS === "web") {
      const { HealthDummyAdapter } = require("./HealthDummy");
      if (await HealthDummyAdapter.isAvailable()) {
        _healthAdapter = new HealthDummyAdapter();
      }
    }
    await _healthAdapter?.init(__DEV__);
    healthAdapterInitialised = true;
  }
  return _healthAdapter;
}
