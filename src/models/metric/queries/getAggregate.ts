import { db } from "@/index";
import { MetricType } from "@prisma/client";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";

enum AggregateOperation {
  count = "count",
  avg = "avg",
  min = "min",
  max = "max",
  stddev = "stddev",
}

const getAggregateSchema = z.object({
  metricType: z.nativeEnum(MetricType),
  operations: z
    .array(z.nativeEnum(AggregateOperation))
    .or(z.nativeEnum(AggregateOperation)),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
});

interface MetricAggregate {
  id: string;
  metricType: MetricType;
  operations: AggregateOperation[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
}

/**
 * Retrieve aggregate statistics for an athlete’s performance metrics
 * @param {string} id The ID of the athlete to retrieve statistics for
 * @param {string} metricType The type of metric to retrieve statistics for
 * @param {string} operations The operation to perform on the metric values (average, max, min, count, stddev)
 */
async function getAggregate(req: MetricAggregate) {
  const athlete = await db.athlete.findUnique({ where: { id: req.id } });
  if (!athlete) {
    throw new HTTPException(404, { message: "Athlete not found" });
  }
  function checkOp(op: AggregateOperation) {
    return req.operations.includes(op);
  }
  const aggregate = await db.metric.aggregate({
    where: {
      athleteId: req.id,
      metricType: req.metricType,
      timestamp: { gte: req.dateRange.start, lte: req.dateRange.end },
    },
    ...(checkOp(AggregateOperation.avg) && { _avg: { value: true } }),
    ...(checkOp(AggregateOperation.count) && { _count: { value: true } }),
    ...(checkOp(AggregateOperation.min) && { _min: { value: true } }),
    ...(checkOp(AggregateOperation.max) && { _max: { value: true } }),
  });

  const res = {
    count: aggregate._count?.value,
    avg: aggregate._avg?.value,
    min: aggregate._min?.value,
    max: aggregate._max?.value,
  };

  if (req.operations.includes(AggregateOperation.stddev) && req.dateRange) {
    const metrics = await db.metric.findMany({
      where: {
        athleteId: req.id,
        metricType: req.metricType,
        timestamp: {
          gte: req.dateRange.start,
          lte: req.dateRange.end,
        },
      },
    });
    const avg =
      metrics.reduce((acc, curr) => acc + curr.value, 0) / metrics.length;
    const stddev = Math.sqrt(
      metrics.reduce((acc, curr) => acc + Math.pow(curr.value - avg, 2), 0) /
        metrics.length
    );
    return { ...res, stddev };
  }
  return res;
}

export {
  getAggregate,
  getAggregateSchema,
  MetricAggregate,
  AggregateOperation,
};
