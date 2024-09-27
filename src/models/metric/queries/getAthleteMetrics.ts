import { db } from "@/index";
import { MetricType } from "@prisma/client";
import { z } from "zod";

// The id for the athlete is provided through the request params
const getAthleteMetricsSchema = z.object({
  metricTypes: z.array(z.nativeEnum(MetricType)),
  dateRange: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .optional(),
});

type DateRange = {
  start: Date;
  end: Date;
};
interface GetAthleteMetricsRequest {
  id: string;
  metricTypes: MetricType[];
  dateRange?: DateRange;
}

/**
 * Retrieve an athlete's performance metrics
 * @param {string} id The ID of the athlete to retrieve metrics for
 * @param {MetricType} metricTypes The type of metrics to retrieve
 * @param {DateRange} dateRange The date range to retrieve metrics for
 * @returns {Metric[]} The athlete's performance metrics
 */
async function getAthleteMetrics(req: GetAthleteMetricsRequest) {
  const metrics = await db.metric.findMany({
    where: {
      athleteId: req.id,
      metricType: { in: req.metricTypes },
      timestamp: req.dateRange
        ? { gte: req.dateRange.start, lte: req.dateRange.end }
        : undefined,
    },
  });
  return metrics;
}

export { getAthleteMetrics, getAthleteMetricsSchema, GetAthleteMetricsRequest };
