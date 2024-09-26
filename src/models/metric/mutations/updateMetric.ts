import { db } from "@/index";
import { MetricType, Unit } from "@prisma/client";

interface UpdateMetric {
  id: string;
  metricType?: MetricType;
  unit?: Unit;
  value?: number;
  timestamp?: Date;
}

export default async function updateMetric(req: UpdateMetric) {
  const res = await db.metric.update({
    where: { id: req.id },
    data: {
      metricType: req.metricType,
      unit: req.unit,
      value: req.value,
      timestamp: req.timestamp,
    },
  });
  return res;
}
