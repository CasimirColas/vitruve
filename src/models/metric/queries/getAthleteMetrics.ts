import { db } from "@/index";
import { MetricType } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

// metricType could be a single MetricType if only one is provided in the query
const getAthleteMetricsSchema = z.object({
  metricTypes: z.array(z.nativeEnum(MetricType)).or(z.nativeEnum(MetricType)),
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
  const athlete = await db.athlete.findUnique({ where: { id: req.id } });
  if (!athlete) {
    throw new HTTPException(404, { message: "Athlete not found" });
  }
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
