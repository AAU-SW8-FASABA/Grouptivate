import { AppState } from "react-native";
import { get as getGroups } from "./server/groups";
import { patch as patchGoal } from "./server/group/goal";
import { Interval } from "./API/schemas/Interval";
import { OtherActivity, SportActivity } from "./API/schemas/Activity";
import { Metric } from "./API/schemas/Metric";
import { HealthAdapter } from "./HealthAdapter/HealthAdapter";
import { getHealthAdapter } from "./HealthAdapter/Helpers";
import { getStartDateFromInterval } from "./IntervalDates";
import { showAlert } from "./Alert";
import { Group } from "./API/schemas/Group";

/**
 * Sync new activity information to the server.
 */
export async function SetupActivitySync(userId: string) {
  // Runs every time the app is opened or closed
  AppState.addEventListener("change", SyncActivity);

  // Run once at app startup
  await SyncActivity(userId);
}

export async function SyncActivity(userId: string, groups?: Group[]) {
  const healthAdapter = await getHealthAdapter();
  if (!healthAdapter) {
    console.log(
      "Unable to sync health because there is no health adapter available",
    );
    return;
  }

  if (!groups) {
    const groupsResponse = await getGroups();

    if (groupsResponse.error) {
      showAlert(groupsResponse);
      return;
    }

    groups = groupsResponse.data;
  }

  if (groups.length === 0) {
    console.info("Did not sync activity progress because there are no groups.");
    return;
  }

  const goalUpdates = await Promise.all(
    groups
      .map((group) =>
        group.goals
          .filter((goal) => userId in goal.progress)
          .map(async (goal) => ({
            goalId: goal.goalId,
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

  if (goalUpdates.length === 0) {
    console.info("Did not sync activity progress because there are no goals.");
    return;
  }

  const patchResponse = await patchGoal(goalUpdates);

  if (patchResponse.error) {
    showAlert(patchResponse);
    return;
  }
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
