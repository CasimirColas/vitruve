import { db } from "@/index";
import { MetricType } from "@prisma/client";
import { z } from "zod";

const getAthleteMetricsSchema = z.object({
  metricTypes: z.array(z.nativeEnum(MetricType)),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
});

type DateRange = {
  start?: Date;
  end?: Date;
};
interface GetAthleteMetricsRequest {
  id: string;
  metricTypes: MetricType[];
  dateRange: DateRange;
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
      timestamp: { gte: req.dateRange.start, lte: req.dateRange.end },
    },
  });
  return metrics;
}

export { getAthleteMetrics, getAthleteMetricsSchema, GetAthleteMetricsRequest };
