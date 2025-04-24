import { Metric } from "./API/schemas/Metric";

export type MetricMetadata = {
  /**
   * The name of the unit that is used for this type of metric.
   */
  unit: string;
};

export const metricMetadata: Record<Metric, MetricMetadata> = {
  duration: { unit: "min" },
  distance: { unit: "m" },
  count: { unit: "" },
  calories: { unit: "kcal" },
};
