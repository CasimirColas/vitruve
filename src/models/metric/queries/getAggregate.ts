import { db } from "@/index";
import type { MetricType } from "@prisma/client";

interface MetricAggregate {
  id: string;
  metricType: MetricType;
  opperations: ("sum" | "avg" | "min" | "max" | "stddev")[];
}

export default async function getAggregate(req: MetricAggregate) {
  function checkOp(op: string) {
    return ["sum", "avg", "min", "max"].includes(op);
  }

  const aggregate = await db.metric.aggregate({
    where: { athleteId: req.id },
    ...(checkOp("avg") && { _avg: { value: true } }),
    ...(checkOp("sum") && { _count: { value: true } }),
    ...(checkOp("min") && { _min: { value: true } }),
    ...(checkOp("max") && { _max: { value: true } }),
  });

  const res = {
    sum: aggregate._count,
    avg: aggregate._avg,
    min: aggregate._min,
    max: aggregate._max,
  };

  if (req.opperations.includes("stddev")) {
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
