import { db } from "@/index";
import { MetricType } from "@prisma/client";
import { z } from "zod";

enum AggregateOperations {
  sum,
  avg,
  min,
  max,
  stddev,
}

const getAggregateSchema = z.object({
  metricType: z.nativeEnum(MetricType),
  operations: z.array(z.nativeEnum(AggregateOperations)),
  start: z.string().datetime(),
  end: z.string().datetime(),
});

interface MetricAggregate {
  id: string;
  metricType: MetricType;
  operations: AggregateOperations[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

/**
 * Retrieve aggregate statistics for an athlete’s performance metrics
 * @param {string} id The ID of the athlete to retrieve statistics for
 * @param {string} metricType The type of metric to retrieve statistics for
 * @param {string} operations The operation to perform on the metric values (average, max, min, total, stddev)
 */
async function getAggregate(req: MetricAggregate) {
  function checkOp(op: AggregateOperations) {
    return req.operations.includes(op);
  }

  const aggregate = await db.metric.aggregate({
    where: {
      athleteId: req.id,
      timestamp: { gte: req.dateRange.start, lte: req.dateRange.end },
    },
    ...(checkOp(AggregateOperations.avg) && { _avg: { value: true } }),
    ...(checkOp(AggregateOperations.sum) && { _count: { value: true } }),
    ...(checkOp(AggregateOperations.min) && { _min: { value: true } }),
    ...(checkOp(AggregateOperations.max) && { _max: { value: true } }),
  });

  const res = {
    sum: aggregate._count,
    avg: aggregate._avg,
    min: aggregate._min,
    max: aggregate._max,
  };

  if (req.operations.includes(AggregateOperations.stddev) && req.dateRange) {
    const metrics = await db.metric.findMany({ where: { athleteId: req.id } });
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
  AggregateOperations,
};
