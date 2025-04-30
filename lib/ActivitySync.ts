import { AppState } from "react-native";
import { get as getUser } from "./server/user";
import { get as getGroup } from "./server/group";
import { patch as patchGoal } from "./server/group/goal";
import { Interval } from "./API/schemas/Interval";
import { OtherActivity, SportActivity } from "./API/schemas/Activity";
import { Metric } from "./API/schemas/Metric";
import { HealthAdapter } from "./HealthAdapter/HealthAdapter";
import { getHealthAdapter } from "./HealthAdapter/Helpers";

/**
 * Sync new activity information to the server.
 */
export function SetupActivitySync() {
  // Runs every time the app is opened or closed
  AppState.addEventListener("change", SyncActivity);

  // Run once at app startup
  SyncActivity();
}

export async function SyncActivity() {
  const healthAdapter = await getHealthAdapter();
  if (!healthAdapter) {
    console.log(
      "Unable to sync health because there is no health adapter available",
    );
    return;
  }

  const user = await getUser();

  const groups = await Promise.all(user.groups.map((group) => getGroup(group)));

  const goalUpdates = await Promise.all(
    groups
      .map((group) =>
        group.goals.map(async (goal) => ({
          uuid: goal.uuid,
          progress: await getGoalProgress(
            healthAdapter,
            goal.activity,
            goal.metric,
            group.interval,
          ),
        })),
      )
      .flat(),
  );

  await patchGoal(goalUpdates);
}

async function getGoalProgress(
  adapter: HealthAdapter,
  activity: SportActivity | OtherActivity,
  metric: Metric,
  interval: Interval,
): Promise<number> {
  const startDate = getStartDateFromInterval(interval);

  return await adapter.getData({
    startDate,
    endDate: new Date(),
    activity,
    metric,
  });
}

function getStartDateFromInterval(interval: Interval): Date {
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
