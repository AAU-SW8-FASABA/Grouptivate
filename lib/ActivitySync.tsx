import { AppState } from "react-native";
import { User } from "./API/schemas/User";
import { Group } from "./API/schemas/Group";
import { get as getUser } from "./server/user";
import { get as getGroups } from "./server/groups";
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

  let user: User;
  try {
    user = await getUser();
  } catch {
    console.warn("Unable sync activity progress, could not fetch user");
    return;
  }
  let groups: Group[];
  try {
    groups = await getGroups();
  } catch {
    console.warn("Unable sync activity progress, could not fetch groups");
    return;
  }

  if (groups.length === 0) {
    console.info("Did not sync activity progress because there are no groups.");
    return;
  }

  const goalUpdates = await Promise.all(
    groups
      .map((group) =>
        group.goals
          .filter((goal) => user.userId in goal.progress)
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

  try {
    await patchGoal(goalUpdates);
  } catch {
    console.warn(`Unable to sync activity progress`);
    return;
  }
  console.info("Succesfully synced activity progress");
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
