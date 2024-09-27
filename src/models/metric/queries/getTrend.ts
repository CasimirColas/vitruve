import { db } from "@/index";
import { MetricType } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { z } from "zod";

// The id for the athlete will be provided through the request params
const getTrendSchema = z.object({
  metricType: z.nativeEnum(MetricType),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }),
});

type DateRange = {
  start: Date;
  end: Date;
};
interface Trend {
  athleteId: string;
  metricType: MetricType;
  dateRange: DateRange;
}

/**
 * Retrieve the trend of an athlete’s performance metrics over time
 * @param {string} athleteId The ID of the athlete to retrieve the trend for
 * @param {MetricType} metricType The type of metric to retrieve the trend for
 * @param {DateRange} dateRange The date range to retrieve the trend for
 * @returns {Object} The trend of the athlete's metric
 */
async function getTrend(req: Trend) {
  const metrics = await db.metric.findMany({
    where: {
      athleteId: req.athleteId,
      metricType: req.metricType,
      timestamp: { gte: req.dateRange.start, lte: req.dateRange.end },
    },
    orderBy: { timestamp: "asc" },
  });

  const data = metrics.map((metric, i) => ({
    value: metric.value,
    timestamp: metric.timestamp,
  }));

  /**
   * To calculate the trend for an athlete's metric we will format the data the following way:
   * - There will be only one data point per day (the first one if there are multiple)
   * - X axis will the number of days since the start of the date range
   * - Y axis will be the value of the metric
   */

  const formatedData = data
    .map((metric) => ({
      x: differenceInDays(metric.timestamp, data[0].timestamp),
      y: metric.value,
    }))
    .filter((metric, i, arr) => {
      if (i === 0) return true;
      return metric.x > arr[i - 1].x;
    });

  function linearRegression(data: { x: number; y: number }[]) {
    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += data[i].x;
      sumY += data[i].y;
      sumXY += data[i].x * data[i].y;
      sumX2 += data[i].x ** 2;
    }

    // Calculate the slope and intercept

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  return {
    data,
    trainingData: formatedData,
    trend: linearRegression(formatedData),
  };
}

export { getTrend, getTrendSchema };
