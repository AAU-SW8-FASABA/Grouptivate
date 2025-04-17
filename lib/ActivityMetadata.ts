import { OtherActivity, SportActivity } from "./API/schemas/Activity";
import { IconSource } from "@/components/ui/UniversalIcon";
import { Metric } from "./API/schemas/Metric";

/**
 * Ikoner kan søges frem på https://icons.expo.fyi
 */

export type ActivityMetadata = {
  /**
   * By default, an activity supports all metrics.
   * If this is set, the activity only supports the set metrics.
   */
  metrics?: Metric[];
  /**
   * The source icon. We try to use MaterialCommunityIcons where possible.
   */
  iconSource: IconSource;
  /**
   * The name of the icon.
   */
  icon: string;
};

export const otherActivityMetadata: Record<OtherActivity, ActivityMetadata> = {
  activeCaloriesBurned: {
    metrics: [Metric.Calories],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "fire",
  },
  floorsClimbed: {
    metrics: [Metric.Count],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "stairs",
  },
  steps: {
    metrics: [Metric.Count],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "shoe-print",
  },
};

export const sportActivityMetadata: Record<SportActivity, ActivityMetadata> = {
  badminton: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "badminton",
  },
  baseball: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "baseball-bat",
  },
  basketball: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "basketball",
  },
  biking: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "bike",
  },
  boxing: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "boxing-glove",
  },
  cricket: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "cricket",
  },
  dancing: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "human-female-dance",
  },
  elliptical: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "run",
  },
  fencing: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "fencing",
  },
  football: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "soccer",
  },
  footballAmerican: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "football",
  },
  footballAustralian: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "football-australian",
  },
  frisbee: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "disc",
  },
  golf: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "golf",
  },
  gymnastics: {
    iconSource: IconSource.MaterialIcons,
    icon: "sports-gymnastics",
  },
  handball: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "handball",
  },
  hiking: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "hiking",
  },
  hockey: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "hockey-sticks",
  },
  martialArts: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialIcons,
    icon: "sports-martial-arts",
  },
  paddling: {
    iconSource: IconSource.FontAwesome6,
    icon: "table-tennis-paddle-ball",
  },
  pilates: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "yoga",
  },
  racquetball: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "racquetball",
  },
  rockClimbing: {
    iconSource: IconSource.FontAwesome6,
    icon: "hill-rockslide",
  },
  rowing: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "rowing",
  },
  rugby: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "rugby",
  },
  running: {
    iconSource: IconSource.FontAwesome6,
    icon: "person-running",
  },
  sailing: {
    iconSource: IconSource.MaterialIcons,
    icon: "sailing",
  },
  skating: {
    iconSource: IconSource.FontAwesome6,
    icon: "person-skating",
  },
  skiing: {
    iconSource: IconSource.MaterialIcons,
    icon: "downhill-skiing",
  },
  snowboarding: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "snowboard",
  },
  softball: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "baseball-bat",
  },
  squash: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "tennis",
  },
  stairclimbing: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "stairs-up",
  },
  strengthTraining: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "arm-flex-outline",
  },
  stretching: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.FontAwesome6,
    icon: "person-falling",
  },
  surfing: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "surfing",
  },
  swimming: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "swim",
  },
  tableTennis: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "table-tennis",
  },
  tennis: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "tennis",
  },
  volleyball: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "volleyball",
  },
  walking: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "walk",
  },
  waterPolo: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "water-polo",
  },
  wheelchair: {
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "wheelchair-accessibility",
  },
  yoga: {
    metrics: [Metric.Count, Metric.Calories, Metric.Duration],
    iconSource: IconSource.MaterialCommunityIcons,
    icon: "yoga",
  },
};
